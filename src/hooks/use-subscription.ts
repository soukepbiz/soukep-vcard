'use client'

import { isPremium } from '@/lib/utils'
import { TIER_LIMITS } from '@/lib/constants'
import type { Profile } from '@/types/profile'

// Set NEXT_PUBLIC_DEV_PREMIUM=true in .env.local to unlock all premium features locally
const DEV_PREMIUM = process.env.NEXT_PUBLIC_DEV_PREMIUM === 'true'

export function useSubscription(profile: Pick<Profile, 'subscription_type' | 'subscription_expires_at'> | null) {
  if (DEV_PREMIUM) {
    return { premium: true, tier: 'premium' as const, limits: TIER_LIMITS.premium }
  }

  const premium = profile
    ? isPremium(profile.subscription_type, profile.subscription_expires_at)
    : false

  const tier = premium
    ? (profile?.subscription_type as 'premium' | 'lifetime')
    : 'free'

  const limits = TIER_LIMITS[tier]

  return { premium, tier, limits }
}
