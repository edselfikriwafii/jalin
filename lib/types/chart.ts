// TypeScript types untuk field `chartData` di model Question
//
// Format JSON ini digunakan oleh:
// 1. AI (Claude/Gemini) — saat generate soal Part 1
// 2. Komponen Recharts — saat merender grafik di halaman soal
// 3. Prisma — disimpan sebagai Json? di kolom chartData

// Satu titik data di grafik, mis. { name: "2000", USA: 43, UK: 26 }
// Kunci selain "name" adalah nama series yang nilainya berupa angka
export type ChartDataPoint = {
  name: string // label sumbu X (mis. tahun, kategori)
  [key: string]: string | number
}

// Tipe grafik yang didukung — sesuai jenis soal IELTS Part 1
export type ChartType = 'bar' | 'line' | 'pie' | 'table'

// Satu baris data untuk tipe "table"
export type TableRow = {
  [key: string]: string | number
}

// Struktur lengkap chartData — yang disimpan di database dan dibaca Recharts
export type ChartData =
  | BarLineChartData
  | PieChartData
  | TableChartData

// Untuk bar chart dan line chart — struktur serupa
export type BarLineChartData = {
  type: 'bar' | 'line'
  title: string        // judul grafik, mis. "Internet Usage by Country, 2000–2020"
  xAxisLabel?: string  // label sumbu X, mis. "Year"
  yAxisLabel?: string  // label sumbu Y, mis. "% of Population"
  unit?: string        // satuan untuk tooltip, mis. "%" atau "million tonnes"
  series: string[]     // nama-nama garis/batang, mis. ["USA", "UK", "Japan"]
  data: ChartDataPoint[]
}

// Untuk pie chart — hanya satu set data
export type PieChartData = {
  type: 'pie'
  title: string
  unit?: string
  data: Array<{
    name: string   // label segmen, mis. "Coal"
    value: number  // nilai segmen
  }>
}

// Untuk tabel data — umum di IELTS Part 1
export type TableChartData = {
  type: 'table'
  title: string
  unit?: string
  columns: string[]  // header kolom
  rows: TableRow[]   // data per baris
}

// Type guard — cek apakah sebuah nilai adalah ChartData yang valid
export function isChartData(value: unknown): value is ChartData {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    v.type === 'bar' ||
    v.type === 'line' ||
    v.type === 'pie' ||
    v.type === 'table'
  )
}
