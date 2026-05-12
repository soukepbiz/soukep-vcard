import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isPremium } from '@/lib/utils'
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard'
import Link from 'next/link'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_type, subscription_expires_at')
    .eq('id', user.id)
    .single()

  const premium = profile ? isPremium(profile.subscription_type || 'free', profile.subscription_expires_at) : false

  if (!premium) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Statistiques Premium</h2>
        <p className="text-gray-500 max-w-xs">
          Accédez aux statistiques détaillées de vos visiteurs avec un abonnement Premium.
        </p>
        <Link
          href="/dashboard/settings"
          className="px-6 py-3 bg-[#0099FF] text-white rounded-xl text-sm font-medium hover:bg-[#0077CC] transition-colors"
        >
          Passer à Premium
        </Link>
      </div>
    )
  }

  // Fetch initial data for 30 days
  const { data: views } = await supabase
    .from('profile_views')
    .select('*')
    .eq('profile_id', user.id)
    .gte('viewed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('viewed_at', { ascending: false })

  // Process data
  const viewsList = views || []

  // KPIs
  const totalViews = viewsList.length
  const uniqueIPs = new Set(viewsList.map(v => v.viewer_ip).filter(Boolean))
  const uniqueVisitors = uniqueIPs.size
  const countries = new Set(viewsList.map(v => v.country).filter(Boolean))
  const countriesCount = countries.size
  const lastView = viewsList[0]?.viewed_at || null

  // Views by day
  const viewsByDay: Record<string, number> = {}
  viewsList.forEach(v => {
    const day = v.viewed_at.split('T')[0]
    viewsByDay[day] = (viewsByDay[day] || 0) + 1
  })

  // By hour
  const byHour = Array(24).fill(0)
  viewsList.forEach(v => {
    const hour = new Date(v.viewed_at).getHours()
    byHour[hour]++
  })

  // By device, browser, OS, country
  const byDevice: Record<string, number> = {}
  const byBrowser: Record<string, number> = {}
  const byOS: Record<string, number> = {}
  const byCountry: Record<string, number> = {}

  viewsList.forEach(v => {
    byDevice[v.device_type || 'unknown'] = (byDevice[v.device_type || 'unknown'] || 0) + 1
    byBrowser[v.browser || 'unknown'] = (byBrowser[v.browser || 'unknown'] || 0) + 1
    byOS[v.os || 'unknown'] = (byOS[v.os || 'unknown'] || 0) + 1
    byCountry[v.country || 'unknown'] = (byCountry[v.country || 'unknown'] || 0) + 1
  })

  // Recent visitors
  const recentVisitors = viewsList.slice(0, 50).map(v => ({
    id: v.id,
    viewedAt: v.viewed_at,
    ip: v.viewer_ip,
    country: v.country,
    city: v.city,
    deviceType: v.device_type,
    browser: v.browser,
    os: v.os,
    referrer: v.referrer,
  }))

  const initialData = {
    kpis: {
      totalViews,
      uniqueVisitors,
      countries: countriesCount,
      lastView,
    },
    viewsByDay,
    byHour,
    byDevice,
    byBrowser,
    byOS,
    byCountry,
    recentVisitors,
  }

  return <AnalyticsDashboard initialData={initialData} />
}
