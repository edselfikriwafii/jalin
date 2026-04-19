'use client'

// Grafik tren overall band score dari waktu ke waktu
// Menggunakan Recharts LineChart — perlu 'use client' karena Recharts adalah library browser

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import type { ScoreTrendPoint } from '@/lib/analytics'

interface ScoreTrendProps {
  data: ScoreTrendPoint[]
}

export default function ScoreTrend({ data }: ScoreTrendProps) {
  if (data.length < 2) {
    return (
      <div className="h-40 flex items-center justify-center text-text-secondary text-sm">
        Butuh minimal 2 latihan dengan penilaian untuk menampilkan grafik tren.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#6B6355' }}
          tickLine={false}
          axisLine={{ stroke: '#C9BC9E' }}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[0, 9]}
          ticks={[0, 3, 4.5, 6, 7, 8, 9]}
          tick={{ fontSize: 11, fill: '#6B6355' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: '#FAF8F4',
            border: '1px solid #C9BC9E',
            borderRadius: '6px',
            fontSize: 12,
            color: '#1A1A1A',
          }}
          formatter={(value) => [`Band ${value}`, 'Overall Score']}
          labelStyle={{ color: '#6B6355', marginBottom: 2 }}
        />
        {/* Garis referensi band 6.0 dan 7.0 — target umum IELTS */}
        <ReferenceLine y={6} stroke="#C9BC9E" strokeDasharray="3 3" />
        <ReferenceLine y={7} stroke="#2E7D60" strokeDasharray="3 3" strokeOpacity={0.5} />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#E04B3A"
          strokeWidth={2}
          dot={{ fill: '#E04B3A', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
