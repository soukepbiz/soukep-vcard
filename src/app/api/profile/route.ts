import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { TIER_LIMITS } from '@/lib/constants'
import { isPremium } from '@/lib/utils'

const ALLOWED_FIELDS = [
  'username', 'first_name', 'last_name', 'full_name', 'job_title', 'company', 'bio', 'bio_title',
  'avatar_url', 'cover_url', 'social_links', 'phone_numbers', 'emails',
  'location', 'accent_color', 'text_color', 'is_published',
]

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_type, subscription_expires_at')
    .eq('id', user.id)
    .single()

  return NextResponse.json({
    email: user.email,
    profile,
  })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const body = await request.json()

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('subscription_type, subscription_expires_at')
    .eq('id', user.id)
    .single()

  const devPremium = process.env.NEXT_PUBLIC_DEV_PREMIUM === 'true'
  const premium = devPremium || (currentProfile
    ? isPremium(currentProfile.subscription_type, currentProfile.subscription_expires_at)
    : false)

  const maxLinks = premium ? TIER_LIMITS.premium.maxLinks : TIER_LIMITS.free.maxLinks

  if (body.social_links && Array.isArray(body.social_links) && body.social_links.length > maxLinks) {
    return NextResponse.json(
      { error: `Limite de ${maxLinks} liens atteinte pour votre abonnement` },
      { status: 400 }
    )
  }

  // Whitelist only updatable fields
  const updateData: Record<string, unknown> = {}
  for (const field of ALLOWED_FIELDS) {
    if (field in body) updateData[field] = body[field]
  }

  // Prevent non-premium users from setting custom colors
  if (!premium) {
    delete updateData.accent_color
    delete updateData.text_color
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ success: true })
  }

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
