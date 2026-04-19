// Fungsi query untuk mengambil soal dari database
// Digunakan oleh halaman daftar soal (Step 5) dan halaman menulis (Step 6)

import { prisma } from '@/lib/prisma'
import type { QuestionType, Difficulty } from '@prisma/client'

// Filter opsional untuk daftar soal
export interface QuestionFilters {
  type?: QuestionType
  difficulty?: Difficulty
}

// Ambil semua soal dengan filter opsional — untuk halaman daftar soal
export async function getQuestions(filters?: QuestionFilters) {
  return prisma.question.findMany({
    where: {
      ...(filters?.type && { type: filters.type }),
      ...(filters?.difficulty && { difficulty: filters.difficulty }),
    },
    select: {
      id: true,
      type: true,
      topic: true,
      difficulty: true,
      // Tidak ambil chartData dan body di daftar soal — data besar, muat saat detail saja
      _count: {
        select: { submissions: true },
      },
    },
    orderBy: [
      { type: 'asc' },       // PART1 dulu, baru PART2
      { difficulty: 'asc' }, // EASY → MEDIUM → HARD
    ],
  })
}

// Ambil satu soal lengkap by ID — untuk halaman detail soal dan halaman menulis
export async function getQuestion(id: string) {
  return prisma.question.findUnique({
    where: { id },
    select: {
      id: true,
      type: true,
      topic: true,
      difficulty: true,
      body: true,
      chartData: true, // JSON grafik untuk Part 1, null untuk Part 2
    },
  })
}

// Ambil soal acak untuk latihan cepat
export async function getRandomQuestion(type?: QuestionType) {
  const count = await prisma.question.count({
    where: type ? { type } : undefined,
  })
  const skip = Math.floor(Math.random() * count)
  const questions = await prisma.question.findMany({
    where: type ? { type } : undefined,
    select: { id: true, type: true, topic: true, difficulty: true },
    skip,
    take: 1,
  })
  return questions[0] ?? null
}
