// Skeleton loading untuk dashboard — muncul saat statistik user sedang dimuat

export default function DashboardLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-56 bg-border rounded animate-pulse" />
        <div className="h-4 w-40 bg-border rounded animate-pulse" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-surface border border-border rounded-lg p-5 space-y-2">
            <div className="h-3 w-24 bg-border rounded animate-pulse" />
            <div className="h-9 w-16 bg-border rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="bg-surface border border-border rounded-lg p-5 space-y-3">
        <div className="h-5 w-32 bg-border rounded animate-pulse" />
        <div className="h-44 bg-border rounded animate-pulse" />
      </div>

      {/* Recent submissions */}
      <div className="space-y-3">
        <div className="h-6 w-36 bg-border rounded animate-pulse" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-surface border border-border rounded-lg p-4 flex justify-between items-center">
            <div className="space-y-2 flex-1">
              <div className="flex gap-2">
                <div className="h-4 w-12 bg-border rounded animate-pulse" />
                <div className="h-4 w-16 bg-border rounded animate-pulse" />
              </div>
              <div className="h-4 w-2/3 bg-border rounded animate-pulse" />
              <div className="h-3 w-20 bg-border rounded animate-pulse" />
            </div>
            <div className="h-7 w-10 bg-border rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
