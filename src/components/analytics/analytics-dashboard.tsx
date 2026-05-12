'use client'

import { useState, useTransition } from 'react'
import { KPICards } from './kpi-cards'
import { ViewsChart } from './views-chart'
import { HourlyChart } from './hourly-chart'
import { DeviceChart } from './device-chart'
import { CountryList } from './country-list'
import { VisitorsTable } from './visitors-table'

interface AnalyticsData {
  kpis: {
    totalViews: number
    uniqueVisitors: number
    countries: number
    lastView: string | null
  }
  viewsByDay: Record<string, number>
  byHour: number[]
  byDevice: Record<string, number>
  byBrowser: Record<string, number>
  byOS: Record<string, number>
  byCountry: Record<string, number>
  recentVisitors: Array<{
    id: number
    viewedAt: string
    ip: string | null
    country: string | null
    city: string | null
    deviceType: string | null
    browser: string | null
    os: string | null
    referrer: string | null
  }>
}

interface AnalyticsDashboardProps {
  initialData: AnalyticsData
}

export function AnalyticsDashboard({ initialData }: AnalyticsDashboardProps) {
  const [period, setPeriod] = useState<'7' | '30' | '90'>('30')
  const [data, setData] = useState<AnalyticsData>(initialData)
  const [isPending, startTransition] = useTransition()

  const handlePeriodChange = (newPeriod: '7' | '30' | '90') => {
    setPeriod(newPeriod)
    startTransition(async () => {
      const res = await fetch(`/api/analytics?period=${newPeriod}`)
      if (res.ok) {
        const newData = await res.json()
        setData(newData)
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header with period selector */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Statistiques</h1>
        <div className="flex gap-2">
          {(['7', '30', '90'] as const).map((p) => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p)}
              disabled={isPending}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-[#0099FF] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } disabled:opacity-50`}
            >
              {p === '7' ? '7 jours' : p === '30' ? '30 jours' : '90 jours'}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <KPICards
        totalViews={data.kpis.totalViews}
        uniqueVisitors={data.kpis.uniqueVisitors}
        countries={data.kpis.countries}
        lastView={data.kpis.lastView}
      />

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Views Over Time */}
        <div className="lg:col-span-2">
          <ViewsChart viewsByDay={data.viewsByDay} />
        </div>

        {/* Hourly */}
        <div className="lg:col-span-2">
          <HourlyChart byHour={data.byHour} />
        </div>

        {/* Device & Browser */}
        <div className="lg:col-span-2">
          <DeviceChart byDevice={data.byDevice} byBrowser={data.byBrowser} />
        </div>

        {/* Countries */}
        <div className="lg:col-span-2">
          <CountryList byCountry={data.byCountry} />
        </div>
      </div>

      {/* Visitors Table */}
      <VisitorsTable visitors={data.recentVisitors} />
    </div>
  )
}
