// Dashboard utama — menampilkan statistik progress dan riwayat latihan user
// Semua data diambil dari DB via lib/analytics.ts

import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/auth'
import { getDashboardStats } from '@/lib/analytics'
import ScoreTrend from '@/components/dashboard/score-trend'

export const metadata: Metadata = {
  title: 'Dashboard — Jalin',
}

// Label kriteria untuk tampilan
const CRITERION_LABEL: Record<string, string> = {
  TASK_ACHIEVEMENT: 'Task Achievement',
  TASK_RESPONSE: 'Task Response',
  COHERENCE_AND_COHESION: 'Coherence & Cohesion',
  LEXICAL_RESOURCE: 'Lexical Resource',
  GRAMMATICAL_RANGE_AND_ACCURACY: 'Grammatical Range & Accuracy',
}

export default async function DashboardPage() {
  const session = await auth()
  const stats = await getDashboardStats(session!.user!.id!)

  const hasData = stats.totalSubmissions > 0
  const hasReviews = stats.avgOverallScore !== null

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* ── Sambutan ── */}
      <div className="space-y-1">
        <h1 className="font-serif text-3xl text-text-primary">
          Selamat datang, {session?.user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-text-secondary text-sm">
          {hasData
            ? `${stats.totalSubmissions} latihan selesai${stats.submissionsThisWeek > 0 ? ` · ${stats.submissionsThisWeek} minggu ini` : ''}`
            : 'Siap latihan IELTS Writing hari ini?'}
        </p>
      </div>

      {/* ── Kartu statistik ringkas ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-lg shadow-retro p-5 space-y-1">
          <p className="text-text-secondary text-xs uppercase tracking-wide">Total Latihan</p>
          <p className="font-serif text-3xl text-text-primary">
            {stats.totalSubmissions > 0 ? stats.totalSubmissions : '—'}
          </p>
        </div>
        <div className="bg-surface border border-border rounded-lg shadow-retro p-5 space-y-1">
          <p className="text-text-secondary text-xs uppercase tracking-wide">Rata-rata Band Score</p>
          <p className={`font-serif text-3xl ${
            stats.avgOverallScore === null
              ? 'text-text-primary'
              : stats.avgOverallScore >= 7
              ? 'text-success'
              : stats.avgOverallScore >= 5.5
              ? 'text-warning'
              : 'text-error'
          }`}>
            {stats.avgOverallScore !== null
              ? (stats.avgOverallScore % 1 === 0 ? `${stats.avgOverallScore}.0` : stats.avgOverallScore)
              : '—'}
          </p>
        </div>
        <div className="bg-surface border border-border rounded-lg shadow-retro p-5 space-y-1">
          <p className="text-text-secondary text-xs uppercase tracking-wide">Latihan Minggu Ini</p>
          <p className="font-serif text-3xl text-text-primary">
            {stats.submissionsThisWeek > 0 ? stats.submissionsThisWeek : '—'}
          </p>
        </div>
      </div>

      {/* ── Tren Skor ── */}
      {hasReviews && (
        <div className="bg-surface border border-border rounded-lg shadow-retro p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg text-text-primary">Tren Band Score</h2>
            <div className="flex items-center gap-3 text-xs text-text-secondary">
              <span className="flex items-center gap-1">
                <span className="w-4 border-t border-dashed border-border inline-block" />
                Band 6
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 border-t border-dashed border-success inline-block opacity-50" />
                Band 7
              </span>
            </div>
          </div>
          <ScoreTrend data={stats.scoreTrend} />
        </div>
      )}

      {/* ── Area yang Perlu Ditingkatkan ── */}
      {stats.criterionAverages.length > 0 && (
        <div className="bg-surface border border-border rounded-lg shadow-retro p-5 space-y-4">
          <h2 className="font-serif text-lg text-text-primary">Skor per Kriteria</h2>
          <div className="space-y-2.5">
            {stats.criterionAverages.map(({ criterion, avgScore }) => (
              <div key={criterion} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-primary">
                    {CRITERION_LABEL[criterion] ?? criterion}
                  </span>
                  <span className={`text-sm font-medium ${
                    avgScore >= 7 ? 'text-success' : avgScore >= 5.5 ? 'text-warning' : 'text-error'
                  }`}>
                    {avgScore % 1 === 0 ? `${avgScore}.0` : avgScore}
                  </span>
                </div>
                {/* Progress bar: skala 0–9 */}
                <div className="h-1.5 bg-background rounded-full overflow-hidden border border-border">
                  <div
                    className={`h-full rounded-full transition-all ${
                      avgScore >= 7 ? 'bg-success' : avgScore >= 5.5 ? 'bg-warning' : 'bg-error'
                    }`}
                    style={{ width: `${(avgScore / 9) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Highlight kriteria terendah */}
          {stats.criterionAverages[0] && stats.criterionAverages[0].avgScore < 6 && (
            <p className="text-xs text-text-secondary pt-1">
              <span className="text-warning font-medium">
                {CRITERION_LABEL[stats.criterionAverages[0].criterion]}
              </span>{' '}
              adalah area yang paling perlu ditingkatkan saat ini.
            </p>
          )}
        </div>
      )}

      {/* ── Riwayat Latihan Terbaru ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg text-text-primary">Latihan Terbaru</h2>
          <Link
            href="/questions"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Latihan Baru →
          </Link>
        </div>

        {stats.recentSubmissions.length === 0 ? (
          // State kosong: user belum mengerjakan soal apapun
          <div className="bg-surface border border-border rounded-lg p-8 text-center space-y-3">
            <p className="text-text-primary font-medium">Belum ada latihan</p>
            <p className="text-text-secondary text-sm">
              Mulai dengan memilih soal IELTS Writing di bawah ini.
            </p>
            <Link
              href="/questions"
              className="inline-block px-5 py-2.5 bg-primary text-surface font-medium rounded border border-primary-hover shadow-retro-primary hover:bg-primary-hover transition-colors text-sm"
            >
              Lihat Daftar Soal →
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {stats.recentSubmissions.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/review/${s.id}`}
                  className="flex items-center justify-between gap-4 bg-surface border border-border rounded-lg p-4 hover:shadow-retro hover:-translate-y-0.5 transition-all group"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                        s.questionType === 'PART1' ? 'bg-secondary text-surface' : 'bg-primary text-surface'
                      }`}>
                        {s.questionType === 'PART1' ? 'Part 1' : 'Part 2'}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded border ${
                        s.mode === 'EXAM' ? 'border-warning text-warning' : 'border-success text-success'
                      }`}>
                        {s.mode === 'EXAM' ? 'Ujian' : 'Latihan'}
                      </span>
                    </div>
                    <p className="text-text-primary text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {s.questionTopic}
                    </p>
                    <p className="text-text-secondary text-xs">{s.createdAt}</p>
                  </div>
                  {/* Band score atau status pending */}
                  <div className="shrink-0 text-right">
                    {s.overallScore !== null ? (
                      <span className={`font-serif text-xl font-bold ${
                        s.overallScore >= 7 ? 'text-success' : s.overallScore >= 5.5 ? 'text-warning' : 'text-error'
                      }`}>
                        {s.overallScore % 1 === 0 ? `${s.overallScore}.0` : s.overallScore}
                      </span>
                    ) : (
                      <span className="text-xs text-text-secondary">Tidak dinilai</span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
