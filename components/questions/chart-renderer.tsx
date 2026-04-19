'use client'

// Komponen untuk merender data grafik soal IELTS Part 1
// Mendukung 4 tipe: bar chart, line chart, pie chart, dan tabel
// Dijalankan di client karena Recharts hanya bisa jalan di browser (butuh DOM)

import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { ChartData, BarLineChartData, PieChartData, TableChartData } from '@/lib/types/chart'

// Palet warna untuk seri grafik — diambil dari tema Jalin
const CHART_COLORS = ['#E04B3A', '#2E7D8C', '#1A1A1A', '#D97706', '#2E7D60', '#6B6355']

function BarChartRenderer({ chart }: { chart: BarLineChartData }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chart.data} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#C9BC9E" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip formatter={(value) => [`${value ?? ''}${chart.unit ? ' ' + chart.unit : ''}`, '']} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {chart.series.map((series, i) => (
          <Bar key={series} dataKey={series} fill={CHART_COLORS[i % CHART_COLORS.length]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

function LineChartRenderer({ chart }: { chart: BarLineChartData }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chart.data} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#C9BC9E" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip formatter={(value) => [`${value ?? ''}${chart.unit ? ' ' + chart.unit : ''}`, '']} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {chart.series.map((series, i) => (
          <Line
            key={series}
            type="monotone"
            dataKey={series}
            stroke={CHART_COLORS[i % CHART_COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

function PieChartRenderer({ chart }: { chart: PieChartData }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chart.data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ name, value }) => `${name}: ${value}${chart.unit ?? ''}`}
          labelLine={true}
        >
          {chart.data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value ?? ''}${chart.unit ?? ''}`, '']} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

function TableRenderer({ chart }: { chart: TableChartData }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border bg-background">
            {chart.columns.map((col) => (
              <th key={col} className="text-left px-3 py-2 font-medium text-text-secondary whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chart.rows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-0 hover:bg-background transition-colors">
              {chart.columns.map((col) => (
                <td key={col} className="px-3 py-2 text-text-primary">
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Komponen utama — pilih renderer berdasarkan tipe grafik
export default function ChartRenderer({ chartData }: { chartData: ChartData }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-text-secondary text-center">{chartData.title}</p>
      {chartData.type === 'bar' && <BarChartRenderer chart={chartData as BarLineChartData} />}
      {chartData.type === 'line' && <LineChartRenderer chart={chartData as BarLineChartData} />}
      {chartData.type === 'pie' && <PieChartRenderer chart={chartData as PieChartData} />}
      {chartData.type === 'table' && <TableRenderer chart={chartData as TableChartData} />}
    </div>
  )
}
