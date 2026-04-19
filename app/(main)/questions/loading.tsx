// Skeleton loading untuk daftar soal — muncul saat data sedang diambil dari DB

export default function QuestionsLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      {/* Skeleton header */}
      <div className="space-y-2">
        <div className="h-4 w-24 bg-border rounded animate-pulse" />
        <div className="h-8 w-48 bg-border rounded animate-pulse" />
        <div className="h-4 w-64 bg-border rounded animate-pulse" />
      </div>

      {/* Skeleton filter tabs */}
      <div className="flex gap-2">
        {[80, 120, 110].map((w, i) => (
          <div key={i} className="h-8 bg-border rounded animate-pulse" style={{ width: w }} />
        ))}
      </div>

      {/* Skeleton kartu soal */}
      <ul className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="bg-surface border border-border rounded-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex gap-2">
                  <div className="h-5 w-14 bg-border rounded animate-pulse" />
                  <div className="h-5 w-14 bg-border rounded animate-pulse" />
                </div>
                <div className="h-4 w-3/4 bg-border rounded animate-pulse" />
              </div>
              <div className="h-4 w-20 bg-border rounded animate-pulse shrink-0" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
