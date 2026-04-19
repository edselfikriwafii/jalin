// Daftar saran perbaikan kalimat dari AI
// Setiap item menampilkan kalimat asli, versi revisi, dan alasan perbaikan

interface SentenceFeedbackItem {
  id: string
  original: string
  suggestion: string
  reason: string
  orderIndex: number
}

interface SentenceFeedbackProps {
  items: SentenceFeedbackItem[]
}

export default function SentenceFeedback({ items }: SentenceFeedbackProps) {
  if (items.length === 0) return null

  // Urutkan berdasarkan posisi kemunculan kalimat dalam teks
  const sorted = [...items].sort((a, b) => a.orderIndex - b.orderIndex)

  return (
    <div className="space-y-4">
      {sorted.map((item, idx) => (
        <div
          key={item.id}
          className="bg-surface border border-border rounded-lg shadow-retro overflow-hidden"
        >
          {/* Nomor urut */}
          <div className="bg-background border-b border-border px-4 py-2">
            <span className="text-xs font-medium text-text-secondary">
              Saran #{idx + 1}
            </span>
          </div>

          <div className="p-4 space-y-3">
            {/* Kalimat asli — latar merah muda sangat tipis sebagai penanda */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-error uppercase tracking-wide">
                Kalimat Asli
              </p>
              <p className="text-sm text-text-primary bg-background rounded p-3 border border-border leading-relaxed">
                {item.original}
              </p>
            </div>

            {/* Versi perbaikan — latar hijau tipis */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-success uppercase tracking-wide">
                Saran Perbaikan
              </p>
              <p className="text-sm text-text-primary bg-background rounded p-3 border border-border leading-relaxed">
                {item.suggestion}
              </p>
            </div>

            {/* Alasan singkat */}
            <p className="text-xs text-text-secondary leading-relaxed">
              <span className="font-medium text-text-primary">Alasan: </span>
              {item.reason}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
