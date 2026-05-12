'use client'

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

interface DeviceChartProps {
  byDevice: Record<string, number>
  byBrowser: Record<string, number>
}

const COLORS = ['#0099FF', '#33ADFF', '#80C2FF', '#B3DBFF']
const DEVICE_LABELS: Record<string, string> = {
  mobile: '📱 Mobile',
  tablet: '📱 Tablet',
  desktop: '💻 Desktop',
  unknown: '❓ Unknown',
}

export function DeviceChart({ byDevice, byBrowser }: DeviceChartProps) {
  const deviceData = Object.entries(byDevice)
    .map(([device, count]) => ({
      name: DEVICE_LABELS[device] || device,
      value: count,
    }))
    .sort((a, b) => b.value - a.value)

  const browserData = Object.entries(byBrowser)
    .map(([browser, count]) => ({
      name: browser,
      value: count,
    }))
    .sort((a, b) => b.value - a.value)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Device Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Appareils</h3>
        {deviceData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
              >
                {deviceData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} vue(s)`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400">
            Aucune donnée
          </div>
        )}
      </div>

      {/* Browser Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Navigateurs</h3>
        {browserData.length > 0 ? (
          <div className="flex flex-col gap-2">
            {browserData.map((item, idx) => {
              const total = browserData.reduce((sum, b) => sum + b.value, 0)
              const percent = ((item.value / total) * 100).toFixed(0)
              return (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="flex-1 text-sm text-gray-700">{item.name}</span>
                  <span className="text-xs font-medium text-gray-500">{percent}%</span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400">
            Aucune donnée
          </div>
        )}
      </div>
    </div>
  )
}
