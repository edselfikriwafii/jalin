// Loading state global — ditampilkan saat navigasi antar halaman sedang berlangsung

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex gap-1.5">
        {/* Tiga titik animasi — pola yang familiar dan tidak membutuhkan library */}
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}
