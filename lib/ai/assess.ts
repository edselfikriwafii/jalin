// Engine penilaian AI untuk IELTS Academic Writing
// Urutan: Claude (primary) → Gemini (fallback) → error
// Menggunakan Zod untuk memvalidasi struktur JSON dari respons AI

import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod/v4'
import { buildSystemPrompt, buildUserMessage } from './prompts'
import type { AssessmentResult } from './types'

// ── Schema Zod untuk validasi output AI ──────────────────────────────────────

const CriterionResultSchema = z.object({
  criterion: z.enum([
    'TASK_ACHIEVEMENT',
    'TASK_RESPONSE',
    'COHERENCE_AND_COHESION',
    'LEXICAL_RESOURCE',
    'GRAMMATICAL_RANGE_AND_ACCURACY',
  ]),
  score: z.number().min(0).max(9),
  feedback: z.string().min(1),
})

const SentenceFeedbackSchema = z.object({
  original: z.string().min(1),
  suggestion: z.string().min(1),
  reason: z.string().min(1),
  orderIndex: z.number().int().nonnegative(),
})

const AssessmentResultSchema = z.object({
  overallScore: z.number().min(0).max(9),
  summary: z.string().min(1),
  criteria: z.array(CriterionResultSchema).min(4).max(4),
  sentenceFeedback: z.array(SentenceFeedbackSchema).min(1),
})

// ── Parser JSON dari teks respons AI ─────────────────────────────────────────

// AI kadang mengembalikan JSON yang dibungkus markdown code fence
// Fungsi ini membersihkan pembungkus tersebut sebelum JSON.parse
function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) return fenced[1].trim()
  // Cari awalan { sebagai fallback
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end !== -1) return text.slice(start, end + 1)
  return text.trim()
}

function parseAndValidate(raw: string): AssessmentResult {
  const json = JSON.parse(extractJson(raw))
  const parsed = AssessmentResultSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error(`Validasi JSON gagal: ${parsed.error.issues[0].message}`)
  }
  return parsed.data as AssessmentResult
}

// ── Penilaian via Claude (Anthropic) ─────────────────────────────────────────

async function assessWithClaude(
  questionType: 'PART1' | 'PART2',
  questionBody: string,
  answerContent: string
): Promise<AssessmentResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY tidak diset')

  const client = new Anthropic({ apiKey })

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: buildSystemPrompt(questionType),
    messages: [
      {
        role: 'user',
        content: buildUserMessage(questionType, questionBody, answerContent),
      },
    ],
  })

  // Ambil teks dari blok konten pertama
  const block = response.content[0]
  if (block.type !== 'text') throw new Error('Respons Claude bukan teks')

  return parseAndValidate(block.text)
}

// ── Penilaian via Gemini (Google) ─────────────────────────────────────────────

async function assessWithGemini(
  questionType: 'PART1' | 'PART2',
  questionBody: string,
  answerContent: string
): Promise<AssessmentResult> {
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) throw new Error('GOOGLE_API_KEY tidak diset')

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-lite-preview',
    systemInstruction: buildSystemPrompt(questionType),
  })

  const result = await model.generateContent(
    buildUserMessage(questionType, questionBody, answerContent)
  )

  const text = result.response.text()
  return parseAndValidate(text)
}

// ── Fungsi utama yang dipanggil dari generate.ts ──────────────────────────────

// Urutan: Claude → Gemini → throw error
// generate.ts bertugas menangani error dan memutuskan apakah review tetap disimpan
export async function assess(
  questionType: 'PART1' | 'PART2',
  questionBody: string,
  answerContent: string
): Promise<AssessmentResult> {
  // Coba Claude terlebih dahulu
  try {
    return await assessWithClaude(questionType, questionBody, answerContent)
  } catch (claudeError) {
    console.error('[assess] Claude gagal, mencoba Gemini:', claudeError)
  }

  // Fallback ke Gemini
  try {
    return await assessWithGemini(questionType, questionBody, answerContent)
  } catch (geminiError) {
    console.error('[assess] Gemini juga gagal:', geminiError)
    throw new Error('Semua AI provider gagal menilai jawaban.')
  }
}
