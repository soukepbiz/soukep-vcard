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

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .eq('is_published', true)
    .single()

  if (error || !profile) notFound()

  // Record view (fire and forget)
  supabase
    .from('profile_views')
    .insert({ profile_id: profile.id })
    .then(() => {})

  const typedProfile: Profile = {
    ...profile,
    social_links: Array.isArray(profile.social_links) ? profile.social_links : [],
    phone_numbers: Array.isArray(profile.phone_numbers) ? profile.phone_numbers : [],
    emails: Array.isArray(profile.emails) ? profile.emails : [],
  }

  const showBranding = profile.subscription_type === 'free'

  return <PublicProfile profile={typedProfile} showBranding={showBranding} />
}
