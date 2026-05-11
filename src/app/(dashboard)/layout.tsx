export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LogoutButton } from '@/components/shared/logout-button'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name, avatar_url, subscription_type')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <Image src="/logo-st.png" alt="Soukep" width={28} height={28} className="rounded-md" />
              <span className="font-semibold text-gray-900 text-sm">Soukep vCard</span>
            </Link>
            <div className="hidden sm:flex items-center gap-1">
              <Link href="/dashboard" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                Ma carte
              </Link>
              <Link href="/dashboard/analytics" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                Statistiques
              </Link>
              <Link href="/dashboard/settings" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                Paramètres
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {profile?.username && (
              <Link
                href={`/${profile.username}`}
                target="_blank"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0099FF] bg-[#E6F4FF] hover:bg-[#B3DBFF] rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Voir ma carte
              </Link>
            )}
            <LogoutButton />
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
