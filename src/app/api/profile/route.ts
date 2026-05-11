import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { TIER_LIMITS } from '@/lib/constants'
import { isPremium } from '@/lib/utils'

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const body = await request.json()

  // Fetch current subscription to enforce limits
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('subscription_type, subscription_expires_at')
    .eq('id', user.id)
    .single()

  const premium = currentProfile
    ? isPremium(currentProfile.subscription_type, currentProfile.subscription_expires_at)
    : false

  const maxLinks = premium ? TIER_LIMITS.premium.maxLinks : TIER_LIMITS.free.maxLinks

  if (body.social_links && Array.isArray(body.social_links) && body.social_links.length > maxLinks) {
    return NextResponse.json(
      { error: `Limite de ${maxLinks} liens atteinte pour votre abonnement` },
      { status: 400 }
    )
  }

  // Prevent role escalation
  const { role: _role, id: _id, created_at: _ca, ...updateData } = body

  // Prevent non-premium users from setting custom colors
  if (!premium && updateData.accent_color) {
    delete updateData.accent_color
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
