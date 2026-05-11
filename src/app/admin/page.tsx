import { createClient } from '@/lib/supabase/server'
import { UserTable } from '@/components/admin/user-table'
import type { Profile } from '@/types/profile'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: premiumCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .in('subscription_type', ['premium', 'lifetime'])

  const typedUsers: Profile[] = (users || []).map((u) => ({
    ...u,
    social_links: Array.isArray(u.social_links) ? u.social_links : [],
    phone_numbers: Array.isArray(u.phone_numbers) ? u.phone_numbers : [],
    emails: Array.isArray(u.emails) ? u.emails : [],
  }))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Gestion des utilisateurs</h1>
        <p className="text-sm text-gray-500 mt-1">Panneau d&apos;administration Soukep vCard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Utilisateurs', value: totalUsers ?? 0 },
          { label: 'Premium', value: premiumCount ?? 0 },
          { label: 'Cartes publiées', value: typedUsers.filter((u) => u.is_published).length },
          { label: 'Admins', value: typedUsers.filter((u) => u.role === 'admin').length },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <UserTable users={typedUsers} />
    </div>
  )
}
