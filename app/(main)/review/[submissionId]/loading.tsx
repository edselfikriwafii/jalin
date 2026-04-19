// Skeleton loading untuk halaman review — muncul saat data review dimuat dari DB

export default function ReviewLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      {/* Back link skeleton */}
      <div className="h-4 w-24 bg-border rounded animate-pulse" />

      {/* Header */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="h-5 w-14 bg-border rounded animate-pulse" />
          <div className="h-5 w-20 bg-border rounded animate-pulse" />
        </div>
        <div className="h-7 w-64 bg-border rounded animate-pulse" />
      </div>

      {/* Overall score card */}
      <div className="bg-surface border border-border rounded-lg p-6 flex flex-col items-center gap-3">
        <div className="h-4 w-32 bg-border rounded animate-pulse" />
        <div className="h-16 w-24 bg-border rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-border rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-border rounded animate-pulse" />
      </div>

      {/* Criterion cards skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-36 bg-border rounded animate-pulse" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface border border-border rounded-lg p-5 space-y-2">
            <div className="flex justify-between">
              <div className="h-5 w-40 bg-border rounded animate-pulse" />
              <div className="h-6 w-10 bg-border rounded animate-pulse" />
            </div>
            <div className="h-4 w-full bg-border rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-border rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
