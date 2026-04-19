// Halaman hasil penilaian AI untuk satu submission
// Menampilkan: overall band score, ringkasan, skor per kriteria, saran perbaikan kalimat, jawaban user

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import CriterionCard from '@/components/review/criterion-card'
import SentenceFeedback from '@/components/review/sentence-feedback'
import type { Criterion } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Hasil Penilaian — Jalin',
}

// Urutan tampilan kriteria — Task Achievement/Response selalu pertama
const CRITERION_ORDER: Criterion[] = [
  'TASK_ACHIEVEMENT',
  'TASK_RESPONSE',
  'COHERENCE_AND_COHESION',
  'LEXICAL_RESOURCE',
  'GRAMMATICAL_RANGE_AND_ACCURACY',
]

// Warna band score keseluruhan mengikuti standar IELTS
function overallScoreClass(score: number): string {
  if (score >= 7) return 'text-success'
  if (score >= 5.5) return 'text-warning'
  return 'text-error'
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ submissionId: string }>
}) {
  const { submissionId } = await params
  const session = await auth()

  // Ambil submission beserta soal dan review (jika sudah ada)
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    select: {
      id: true,
      userId: true,
      content: true,
      mode: true,
      durationSeconds: true,
      createdAt: true,
      question: {
        select: {
          id: true,
          type: true,
          topic: true,
          body: true,
        },
      },
      review: {
        select: {
          overallScore: true,
          summary: true,
          criterionScores: {
            select: {
              id: true,
              criterion: true,
              score: true,
              feedback: true,
            },
          },
          sentenceFeedback: {
            select: {
              id: true,
              original: true,
              suggestion: true,
              reason: true,
              orderIndex: true,
            },
          },
        },
      },
    },
  })

  // Submission tidak ditemukan atau bukan milik user yang login
  if (!submission || submission.userId !== session?.user?.id) notFound()

  const { question, review } = submission

  // Urutkan criterion scores mengikuti urutan yang sudah ditentukan
  // Filter hanya criterion yang relevan untuk tipe soal ini
  const sortedCriteria = review
    ? CRITERION_ORDER.filter(
        (c) =>
          // Part 1 tidak punya TASK_RESPONSE, Part 2 tidak punya TASK_ACHIEVEMENT
          !(question.type === 'PART1' && c === 'TASK_RESPONSE') &&
          !(question.type === 'PART2' && c === 'TASK_ACHIEVEMENT')
      )
        .map((c) => review.criterionScores.find((s) => s.criterion === c))
        .filter((s): s is NonNullable<typeof s> => s !== undefined)
    : []

  // Format durasi dari detik ke menit:detik
  function formatDuration(seconds: number | null): string {
    if (!seconds) return '—'
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}m ${s}s`
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      {/* Link kembali ke daftar soal sesuai mode */}
      <Link
        href={submission.mode === 'EXAM' ? '/questions/exam' : '/questions/practice'}
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        ← Coba Soal Lain
      </Link>

      {/* ── Header: identitas soal ── */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded font-medium ${
            question.type === 'PART1' ? 'bg-secondary text-surface' : 'bg-primary text-surface'
          }`}>
            {question.type === 'PART1' ? 'Part 1' : 'Part 2'}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded font-medium border ${
            submission.mode === 'EXAM'
              ? 'border-warning text-warning'
              : 'border-success text-success'
          }`}>
            {submission.mode === 'EXAM' ? 'Mode Ujian' : 'Mode Latihan'}
          </span>
          {submission.durationSeconds !== null && (
            <span className="text-xs text-text-secondary">
              Waktu pengerjaan: {formatDuration(submission.durationSeconds)}
            </span>
          )}
        </div>
        <h1 className="font-serif text-2xl text-text-primary">{question.topic}</h1>
      </div>

      {/* ── Overall Band Score ── */}
      {review ? (
        <div className="bg-surface border border-border rounded-lg shadow-retro p-6 text-center space-y-2">
          <p className="text-sm text-text-secondary uppercase tracking-wide font-medium">
            Overall Band Score
          </p>
          <p className={`font-serif text-6xl font-bold ${overallScoreClass(review.overallScore)}`}>
            {review.overallScore % 1 === 0
              ? `${review.overallScore}.0`
              : review.overallScore}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed max-w-md mx-auto">
            {review.summary}
          </p>
        </div>
      ) : (
        // State ketika AI gagal atau belum selesai
        <div className="bg-surface border border-border rounded-lg p-6 text-center space-y-2">
          <p className="font-medium text-text-primary">Penilaian belum tersedia</p>
          <p className="text-text-secondary text-sm">
            AI tidak berhasil menilai jawaban ini. Jawabanmu tetap tersimpan.
            Coba kerjakan soal lain, atau hubungi kami jika masalah berlanjut.
          </p>
        </div>
      )}

      {/* ── Skor per Kriteria ── */}
      {review && sortedCriteria.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-serif text-lg text-text-primary">Skor per Kriteria</h2>
          {sortedCriteria.map((c) => (
            <CriterionCard
              key={c.id}
              criterion={c.criterion}
              score={c.score}
              feedback={c.feedback}
            />
          ))}
        </div>
      )}

      {/* ── Saran Perbaikan Kalimat ── */}
      {review && review.sentenceFeedback.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-serif text-lg text-text-primary">Saran Perbaikan Kalimat</h2>
          <p className="text-text-secondary text-sm">
            Kalimat-kalimat berikut dipilih AI sebagai contoh area yang bisa diperbaiki.
          </p>
          <SentenceFeedback items={review.sentenceFeedback} />
        </div>
      )}

      {/* ── Jawaban User ── */}
      <div className="space-y-3">
        <h2 className="font-serif text-lg text-text-primary">Jawabanmu</h2>
        <div className="bg-surface border border-border rounded-lg shadow-retro p-5">
          <p className="text-text-primary text-sm leading-relaxed whitespace-pre-line">
            {submission.content}
          </p>
        </div>
      </div>

      {/* ── Soal Asli ── */}
      <div className="space-y-3">
        <h2 className="font-serif text-lg text-text-primary">Soal</h2>
        <div className="bg-background border border-border rounded-lg p-4">
          <p className="text-text-primary text-sm leading-relaxed whitespace-pre-line">
            {question.body}
          </p>
        </div>
      </div>

      {/* ── Tombol aksi bawah ── */}
      <div className="flex gap-3 flex-wrap pt-2">
        <Link
          href={submission.mode === 'EXAM' ? '/questions/exam' : '/questions/practice'}
          className="px-5 py-2.5 bg-primary text-surface font-medium rounded border border-primary-hover shadow-retro-primary hover:bg-primary-hover transition-colors text-sm"
        >
          Coba Soal Lain
        </Link>
        <Link
          href="/dashboard"
          className="px-5 py-2.5 border border-border text-text-secondary hover:text-text-primary hover:bg-background rounded transition-colors text-sm"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  )
}
