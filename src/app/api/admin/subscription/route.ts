import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  // Verify admin role from DB
  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!adminProfile || adminProfile.role !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const { userId, subscriptionType, duration, suspend } = await request.json()

  if (!userId || !subscriptionType) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
  }

  let expiresAt: string | null = null
  if (subscriptionType === 'premium' && duration !== 'lifetime') {
    const now = new Date()
    if (duration === '3months') now.setMonth(now.getMonth() + 3)
    else if (duration === '1year') now.setFullYear(now.getFullYear() + 1)
    expiresAt = now.toISOString()
  }

  const updateData: Record<string, unknown> = {
    subscription_type: subscriptionType,
    subscription_expires_at: expiresAt,
  }

  if (suspend) updateData.is_published = false

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Log the action
  await supabase.from('admin_logs').insert({
    admin_id: user.id,
    target_user_id: userId,
    action: suspend ? 'suspend' : 'force_subscription',
    metadata: { subscriptionType, duration, expiresAt },
  })

  return NextResponse.json({ success: true })
}
