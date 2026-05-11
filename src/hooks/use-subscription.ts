'use client'

import { isPremium } from '@/lib/utils'
import { TIER_LIMITS } from '@/lib/constants'
import type { Profile } from '@/types/profile'

export function useSubscription(profile: Pick<Profile, 'subscription_type' | 'subscription_expires_at'> | null) {
  const premium = profile
    ? isPremium(profile.subscription_type, profile.subscription_expires_at)
    : false

  const tier = premium
    ? (profile?.subscription_type as 'premium' | 'lifetime')
    : 'free'

  const limits = TIER_LIMITS[tier]

  return { premium, tier, limits }
}
