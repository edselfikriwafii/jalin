'use server'

// generateReview: ambil submission dari DB, panggil AI, simpan Review + CriterionScore + SentenceFeedback
// Dipanggil dari actions/write/submit.ts setelah Submission berhasil dibuat

import { prisma } from '@/lib/prisma'
import { assess } from '@/lib/ai/assess'

export async function generateReview(submissionId: string): Promise<void> {
  // Ambil submission beserta soal yang diperlukan untuk prompt AI
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    select: {
      content: true,
      question: {
        select: {
          type: true,
          body: true,
        },
      },
    },
  })

  if (!submission) throw new Error(`Submission ${submissionId} tidak ditemukan`)

  // Panggil AI — Claude → Gemini fallback
  const result = await assess(
    submission.question.type,
    submission.question.body,
    submission.content
  )

  // Simpan Review + relasi ke dalam satu transaksi DB
  // Transaksi memastikan semua tabel tersimpan atau tidak sama sekali
  await prisma.$transaction([
    prisma.review.create({
      data: {
        submissionId,
        overallScore: result.overallScore,
        summary: result.summary,
        criterionScores: {
          create: result.criteria.map((c) => ({
            criterion: c.criterion,
            score: c.score,
            feedback: c.feedback,
          })),
        },
        sentenceFeedback: {
          create: result.sentenceFeedback.map((s) => ({
            original: s.original,
            suggestion: s.suggestion,
            reason: s.reason,
            orderIndex: s.orderIndex,
          })),
        },
      },
    }),
  ])
}
