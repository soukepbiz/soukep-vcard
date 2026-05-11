export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LogoutButton } from '@/components/shared/logout-button'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  // Double guard: verify role directly from DB
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2.5">
              <Image src="/logo-st.png" alt="Soukep" width={28} height={28} className="rounded-md" />
              <span className="font-semibold text-gray-900 text-sm">Admin — Soukep vCard</span>
            </Link>
            <div className="flex items-center gap-1">
              <Link href="/admin" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                Utilisateurs
              </Link>
              <Link href="/admin/logs" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                Journaux
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-xs text-gray-500 hover:text-gray-700">
              Mon dashboard
            </Link>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
