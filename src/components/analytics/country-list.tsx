'use client'

import { getCountryName } from '@/lib/analytics/parser'

interface CountryListProps {
  byCountry: Record<string, number>
}

export function CountryList({ byCountry }: CountryListProps) {
  const countryData = Object.entries(byCountry)
    .map(([code, count]) => ({
      code,
      name: getCountryName(code),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)

  if (countryData.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-center h-80">
        <p className="text-gray-400">Aucune donnée géographique</p>
      </div>
    )
  }

  const maxCount = Math.max(...countryData.map(c => c.count), 1)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Top pays</h3>
      <div className="flex flex-col gap-3">
        {countryData.map(({ code, name, count }) => {
          const percent = (count / maxCount) * 100
          return (
            <div key={code} className="flex items-center gap-3">
              <span className="text-sm font-medium flex-1">{name}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0099FF]"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-600 w-10 text-right">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
