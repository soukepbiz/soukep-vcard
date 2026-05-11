export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PublicProfile } from '@/components/profile/public-profile'
import type { Profile } from '@/types/profile'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('full_name, job_title, company, avatar_url')
    .eq('username', username)
    .eq('is_published', true)
    .single()

  if (!data) return { title: 'Profil introuvable' }

  const name = data.full_name || username
  const description = [data.job_title, data.company].filter(Boolean).join(' chez ')

  return {
    title: `${name} — Soukep vCard`,
    description,
    openGraph: {
      title: name,
      description,
      images: data.avatar_url ? [{ url: data.avatar_url }] : [],
    },
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  // Check if the viewer is the owner of this profile
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (error || !profile) notFound()

  const isOwner = user?.id === profile.id

  // Non-published profiles are only visible to their owner
  if (!profile.is_published && !isOwner) notFound()

  // Record view only for published profiles visited by non-owners
  if (profile.is_published && !isOwner) {
    supabase
      .from('profile_views')
      .insert({ profile_id: profile.id })
      .then(() => {})
  }

  const typedProfile: Profile = {
    ...profile,
    social_links: Array.isArray(profile.social_links) ? profile.social_links : [],
    phone_numbers: Array.isArray(profile.phone_numbers) ? profile.phone_numbers : [],
    emails: Array.isArray(profile.emails) ? profile.emails : [],
  }

  const showBranding = profile.subscription_type === 'free'

  return (
    <>
      {!profile.is_published && isOwner && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white text-center text-xs font-semibold py-2 px-4">
          Aperçu — Cette carte n&apos;est pas encore publiée. Activez la publication depuis votre dashboard.
        </div>
      )}
      <PublicProfile profile={typedProfile} showBranding={showBranding} />
    </>
  )
}
