// Fungsi query untuk statistik dashboard
// Satu query besar + komputasi di memori — lebih efisien daripada banyak query kecil

import { prisma } from '@/lib/prisma'
import type { Criterion } from '@prisma/client'

export interface ScoreTrendPoint {
  date: string  // format: 'DD MMM' untuk label sumbu X
  score: number
}

export interface RecentSubmission {
  id: string
  questionTopic: string
  questionType: 'PART1' | 'PART2'
  mode: 'PRACTICE' | 'EXAM'
  overallScore: number | null  // null jika review belum ada
  createdAt: string            // format: 'DD MMM YYYY'
}

export interface CriterionAvg {
  criterion: Criterion
  avgScore: number
}

export interface DashboardStats {
  totalSubmissions: number
  avgOverallScore: number | null   // null jika belum ada review sama sekali
  submissionsThisWeek: number
  criterionAverages: CriterionAvg[] // diurutkan dari skor terendah ke tertinggi
  recentSubmissions: RecentSubmission[]
  scoreTrend: ScoreTrendPoint[]     // semua submission yang punya review, urut dari lama ke baru
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  // Satu query: semua submission + review + criterion scores
  const submissions = await prisma.submission.findMany({
    where: { userId },
    select: {
      id: true,
      mode: true,
      createdAt: true,
      question: {
        select: { type: true, topic: true },
      },
      review: {
        select: {
          overallScore: true,
          criterionScores: {
            select: { criterion: true, score: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  const totalSubmissions = submissions.length

  // Minggu ini: 7 hari terakhir
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const submissionsThisWeek = submissions.filter(
    (s) => s.createdAt >= oneWeekAgo
  ).length

  // Submission yang punya review
  const withReview = submissions.filter((s) => s.review !== null)

  // Rata-rata overall score
  const avgOverallScore =
    withReview.length === 0
      ? null
      : Math.round(
          (withReview.reduce((sum, s) => sum + (s.review!.overallScore), 0) /
            withReview.length) *
            10
        ) / 10

  // Rata-rata per kriteria — kumpulkan semua criterion scores dari semua review
  const criterionMap = new Map<Criterion, number[]>()
  for (const s of withReview) {
    for (const cs of s.review!.criterionScores) {
      if (!criterionMap.has(cs.criterion)) criterionMap.set(cs.criterion, [])
      criterionMap.get(cs.criterion)!.push(cs.score)
    }
  }

  const criterionAverages: CriterionAvg[] = Array.from(criterionMap.entries())
    .map(([criterion, scores]) => ({
      criterion,
      avgScore:
        Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) /
        10,
    }))
    .sort((a, b) => a.avgScore - b.avgScore) // terendah di depan

  // 5 submission terbaru (urut dari yang paling baru)
  const recent = [...submissions]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5)

  const recentSubmissions: RecentSubmission[] = recent.map((s) => ({
    id: s.id,
    questionTopic: s.question.topic,
    questionType: s.question.type,
    mode: s.mode,
    overallScore: s.review?.overallScore ?? null,
    createdAt: formatDate(s.createdAt),
  }))

  // Tren skor — hanya submission dengan review, urut dari lama ke baru
  const scoreTrend: ScoreTrendPoint[] = withReview.map((s) => ({
    date: formatDate(s.createdAt),
    score: s.review!.overallScore,
  }))

  return {
    totalSubmissions,
    avgOverallScore,
    submissionsThisWeek,
    criterionAverages,
    recentSubmissions,
    scoreTrend,
  }
}

// Format tanggal ke 'DD MMM' atau 'DD MMM YYYY' (jika tahun berbeda dari sekarang)
function formatDate(date: Date): string {
  const now = new Date()
  const opts: Intl.DateTimeFormatOptions =
    date.getFullYear() !== now.getFullYear()
      ? { day: 'numeric', month: 'short', year: 'numeric' }
      : { day: 'numeric', month: 'short' }
  return date.toLocaleDateString('id-ID', opts)
}
