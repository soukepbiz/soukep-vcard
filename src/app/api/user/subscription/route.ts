import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { subscriptionType, duration } = await request.json()

  if (!subscriptionType) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
  }

  let expiresAt: string | null = null
  if (subscriptionType === 'premium') {
    const now = new Date()
    if (duration === '3months') now.setMonth(now.getMonth() + 3)
    else if (duration === '1year') now.setFullYear(now.getFullYear() + 1)
    expiresAt = now.toISOString()
  } else if (subscriptionType === 'lifetime') {
    expiresAt = null
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_type: subscriptionType,
      subscription_expires_at: expiresAt,
    })
    .eq('id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
