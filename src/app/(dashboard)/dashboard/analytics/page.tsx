import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isPremium } from '@/lib/utils'
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

  const premium = profile ? isPremium(profile.subscription_type, profile.subscription_expires_at) : false

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
          Accédez aux statistiques de vues et clics sur vos liens avec un abonnement Premium.
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

  const { data: views } = await supabase
    .from('profile_views')
    .select('viewed_at')
    .eq('profile_id', user.id)
    .gte('viewed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('viewed_at', { ascending: true })

  const totalViews = views?.length || 0

  // Group by day
  const byDay: Record<string, number> = {}
  views?.forEach((v) => {
    const day = v.viewed_at.split('T')[0]
    byDay[day] = (byDay[day] || 0) + 1
  })

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-gray-900">Statistiques</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-3xl font-bold text-gray-900">{totalViews}</p>
          <p className="text-sm text-gray-500 mt-1">Vues (30 jours)</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-3xl font-bold text-gray-900">{Object.keys(byDay).length}</p>
          <p className="text-sm text-gray-500 mt-1">Jours actifs</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="text-sm font-medium text-gray-700 mb-4">Vues par jour (30 derniers jours)</h2>
        <div className="flex items-end gap-1 h-32">
          {Object.entries(byDay).slice(-30).map(([day, count]) => {
            const max = Math.max(...Object.values(byDay), 1)
            const height = Math.max((count / max) * 100, 4)
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1 group" title={`${day}: ${count} vue(s)`}>
                <div
                  className="w-full bg-[#33ADFF] rounded-sm transition-all group-hover:bg-[#0099FF]"
                  style={{ height: `${height}%` }}
                />
              </div>
            )
          })}
          {Object.keys(byDay).length === 0 && (
            <p className="text-sm text-gray-400 m-auto">Aucune vue pour l&apos;instant</p>
          )}
        </div>
      </div>
    </div>
  )
}
