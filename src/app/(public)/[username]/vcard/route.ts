import { createClient } from '@/lib/supabase/server'
import { generateVCard } from '@/lib/vcard/generator'
import { NextResponse } from 'next/server'
import type { Profile } from '@/types/profile'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .eq('is_published', true)
    .single()

  if (error || !profile) {
    return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })
  }

  const typedProfile: Profile = {
    ...profile,
    social_links: Array.isArray(profile.social_links) ? profile.social_links : [],
    phone_numbers: Array.isArray(profile.phone_numbers) ? profile.phone_numbers : [],
    emails: Array.isArray(profile.emails) ? profile.emails : [],
  }

  const vcardContent = await generateVCard(typedProfile)
  const filename = (profile.full_name || profile.username).replace(/\s+/g, '_')

  return new Response(vcardContent, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}.vcf"`,
    },
  })
}
