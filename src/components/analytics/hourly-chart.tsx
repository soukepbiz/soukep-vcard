'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface HourlyChartProps {
  byHour: number[]
}

export function HourlyChart({ byHour }: HourlyChartProps) {
  const data = byHour.map((count, hour) => ({
    hour: `${hour}h`,
    count,
  }))

  const maxCount = Math.max(...byHour, 1)
  const hasData = byHour.some(c => c > 0)

  if (!hasData) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-5 h-80 flex items-center justify-center">
        <p className="text-gray-400">Aucune visite pour le moment</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Vues par heure de la journée</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="hour" stroke="#999" style={{ fontSize: '11px' }} />
          <YAxis stroke="#999" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value) => [`${value} vue(s)`, '']}
          />
          <Bar dataKey="count" fill="#33ADFF" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
