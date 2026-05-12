'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ViewsChartProps {
  viewsByDay: Record<string, number>
}

export function ViewsChart({ viewsByDay }: ViewsChartProps) {
  // Convert to chart data
  const data = Object.entries(viewsByDay)
    .map(([day, count]) => ({
      day: new Date(day).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
      count,
    }))
    .slice(-30) // Last 30 days

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-5 h-80 flex items-center justify-center">
        <p className="text-gray-400">Aucune vue pour le moment</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Vues par jour</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0099FF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0099FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" stroke="#999" style={{ fontSize: '12px' }} />
          <YAxis stroke="#999" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value) => [`${value} vue(s)`, '']}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#0099FF"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
