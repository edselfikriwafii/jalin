// Halaman menulis jawaban — split layout antara panel soal dan panel menulis
// Layout: desktop = side-by-side, mobile = soal di atas (scrollable terbatas) + menulis di bawah

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getQuestion } from '@/lib/questions'
import { isChartData } from '@/lib/types/chart'
import ChartRenderer from '@/components/questions/chart-renderer'
import WriteForm from '@/components/write/write-form'

export const metadata: Metadata = {
  title: 'Menulis Jawaban — Jalin',
}

const DIFFICULTY_LABEL: Record<string, string> = {
  EASY: 'Mudah',
  MEDIUM: 'Sedang',
  HARD: 'Sulit',
}

export default async function WritePage({
  params,
  searchParams,
}: {
  params: Promise<{ questionId: string }>
  searchParams: Promise<{ mode?: string }>
}) {
  const { questionId } = await params
  const { mode } = await searchParams

  const question = await getQuestion(questionId)
  if (!question) notFound()

  // Validasi mode dari URL — default ke PRACTICE jika tidak dikenal
  const practiceMode = mode === 'EXAM' ? 'EXAM' : 'PRACTICE'
  const chartData = isChartData(question.chartData) ? question.chartData : null

  return (
    // Tinggi halaman = viewport dikurangi navbar (h-14)
    <div className="h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row overflow-hidden">

      {/* ── Panel Soal (kiri/atas) ── */}
      <div className="lg:w-2/5 xl:w-1/3 overflow-y-auto border-b lg:border-b-0 lg:border-r border-border bg-surface p-5 space-y-4 max-h-[38vh] lg:max-h-none">
        {/* Header: tipe soal + mode */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${
              question.type === 'PART1' ? 'bg-secondary text-surface' : 'bg-primary text-surface'
            }`}>
              {question.type === 'PART1' ? 'Part 1' : 'Part 2'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded font-medium border border-border text-text-secondary">
              {DIFFICULTY_LABEL[question.difficulty]}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded font-medium border ${
              practiceMode === 'EXAM'
                ? 'border-warning text-warning'
                : 'border-success text-success'
            }`}>
              {practiceMode === 'EXAM' ? 'Mode Ujian' : 'Mode Latihan'}
            </span>
          </div>
          <h1 className="font-serif text-lg text-text-primary leading-snug">
            {question.topic}
          </h1>
        </div>

        {/* Grafik Recharts — hanya untuk Part 1 */}
        {chartData && (
          <div className="bg-background border border-border rounded-lg p-3">
            <ChartRenderer chartData={chartData} />
          </div>
        )}

        {/* Teks soal */}
        <div className="bg-background border border-border rounded-lg p-4">
          <p className="text-text-primary text-sm leading-relaxed whitespace-pre-line">
            {question.body}
          </p>
        </div>

        {/* Link kembali ke daftar soal sesuai mode yang sedang dipakai */}
        <Link
          href={practiceMode === 'EXAM' ? '/questions/exam' : '/questions/practice'}
          className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          ← Ganti soal
        </Link>
      </div>

      {/* ── Panel Menulis (kanan/bawah) — WriteForm adalah client component ── */}
      <WriteForm
        questionId={questionId}
        questionType={question.type}
        mode={practiceMode}
      />
    </div>
  )
}
