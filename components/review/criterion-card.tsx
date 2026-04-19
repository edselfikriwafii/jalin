// Kartu skor satu kriteria penilaian IELTS
// Menampilkan nama kriteria, band score, dan penjelasan detail

import type { Criterion } from '@prisma/client'

// Label dan deskripsi singkat setiap kriteria dalam bahasa Inggris (sesuai IELTS)
const CRITERION_INFO: Record<Criterion, { label: string; abbr: string }> = {
  TASK_ACHIEVEMENT: {
    label: 'Task Achievement',
    abbr: 'TA',
  },
  TASK_RESPONSE: {
    label: 'Task Response',
    abbr: 'TR',
  },
  COHERENCE_AND_COHESION: {
    label: 'Coherence & Cohesion',
    abbr: 'CC',
  },
  LEXICAL_RESOURCE: {
    label: 'Lexical Resource',
    abbr: 'LR',
  },
  GRAMMATICAL_RANGE_AND_ACCURACY: {
    label: 'Grammatical Range & Accuracy',
    abbr: 'GRA',
  },
}

// Warna latar belakang skor mengikuti band IELTS yang lazim digunakan
function scoreBadgeClass(score: number): string {
  if (score >= 7) return 'bg-success text-surface'
  if (score >= 5.5) return 'bg-warning text-surface'
  return 'bg-error text-surface'
}

interface CriterionCardProps {
  criterion: Criterion
  score: number
  feedback: string
}

export default function CriterionCard({
  criterion,
  score,
  feedback,
}: CriterionCardProps) {
  const info = CRITERION_INFO[criterion]

  return (
    <div className="bg-surface border border-border rounded-lg shadow-retro p-5 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Singkatan kriteria sebagai label kecil */}
          <span className="text-xs px-1.5 py-0.5 bg-background border border-border rounded font-mono text-text-secondary">
            {info.abbr}
          </span>
          <h3 className="font-medium text-text-primary text-sm">{info.label}</h3>
        </div>
        {/* Band score — warna mengikuti tingkat skor */}
        <span className={`text-sm font-bold px-2.5 py-1 rounded ${scoreBadgeClass(score)}`}>
          {score % 1 === 0 ? `${score}.0` : score}
        </span>
      </div>

      {/* Penjelasan detail dari AI */}
      <p className="text-text-secondary text-sm leading-relaxed">{feedback}</p>
    </div>
  )
}
