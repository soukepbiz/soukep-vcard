import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileEditor } from '@/components/dashboard/profile-editor'
import type { Profile } from '@/types/profile'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    return (
      <div className="text-center py-16 text-gray-500">
        Profil introuvable. Veuillez vous reconnecter.
      </div>
    )
  }

  const typedProfile: Profile = {
    ...profile,
    social_links: Array.isArray(profile.social_links) ? profile.social_links : [],
    phone_numbers: Array.isArray(profile.phone_numbers) ? profile.phone_numbers : [],
    emails: Array.isArray(profile.emails) ? profile.emails : [],
  }

  return <ProfileEditor profile={typedProfile} />
}
