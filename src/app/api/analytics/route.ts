import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { isPremium } from '@/lib/utils'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_type, subscription_expires_at')
    .eq('id', user.id)
    .single()

  if (!profile || !isPremium(profile.subscription_type || 'free', profile.subscription_expires_at)) {
    return NextResponse.json({ error: 'Premium only' }, { status: 403 })
  }

  const url = new URL(request.url)
  const period = url.searchParams.get('period') || '30'
  const days = parseInt(period) || 30

  // Get all views for the period
  const { data: views } = await supabase
    .from('profile_views')
    .select('*')
    .eq('profile_id', user.id)
    .gte('viewed_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
    .order('viewed_at', { ascending: false })

  if (!views) {
    return NextResponse.json({
      kpis: { totalViews: 0, uniqueVisitors: 0, countries: 0, lastView: null },
      viewsByDay: {},
      byHour: Array(24).fill(0),
      byDevice: {},
      byBrowser: {},
      byOS: {},
      byCountry: {},
      recentVisitors: [],
    })
  }

  // KPIs
  const totalViews = views.length
  const uniqueIPs = new Set(views.map(v => v.viewer_ip).filter(Boolean))
  const uniqueVisitors = uniqueIPs.size
  const countries = new Set(views.map(v => v.country).filter(Boolean))
  const countriesCount = countries.size
  const lastView = views[0]?.viewed_at || null

  // Views by day
  const viewsByDay: Record<string, number> = {}
  views.forEach(v => {
    const day = v.viewed_at.split('T')[0]
    viewsByDay[day] = (viewsByDay[day] || 0) + 1
  })

  // By hour (0-23)
  const byHour = Array(24).fill(0)
  views.forEach(v => {
    const hour = new Date(v.viewed_at).getHours()
    byHour[hour]++
  })

  // By device type
  const byDevice: Record<string, number> = {}
  views.forEach(v => {
    const device = v.device_type || 'unknown'
    byDevice[device] = (byDevice[device] || 0) + 1
  })

  // By browser
  const byBrowser: Record<string, number> = {}
  views.forEach(v => {
    const browser = v.browser || 'unknown'
    byBrowser[browser] = (byBrowser[browser] || 0) + 1
  })

  // By OS
  const byOS: Record<string, number> = {}
  views.forEach(v => {
    const os = v.os || 'unknown'
    byOS[os] = (byOS[os] || 0) + 1
  })

  // By country
  const byCountry: Record<string, number> = {}
  views.forEach(v => {
    const country = v.country || 'unknown'
    byCountry[country] = (byCountry[country] || 0) + 1
  })

  // Recent visitors (latest 50)
  const recentVisitors = views.slice(0, 50).map(v => ({
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

  return NextResponse.json({
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
  })
}
