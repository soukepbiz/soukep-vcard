import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isSubscriptionActive(
  subscriptionType: string,
  subscriptionExpiresAt: string | null
): boolean {
  if (subscriptionType === 'lifetime') return true
  if (subscriptionType === 'free') return false
  if (!subscriptionExpiresAt) return true
  return new Date(subscriptionExpiresAt) > new Date()
}

export function isPremium(
  subscriptionType: string,
  subscriptionExpiresAt: string | null
): boolean {
  return (
    (subscriptionType === 'premium' || subscriptionType === 'lifetime') &&
    isSubscriptionActive(subscriptionType, subscriptionExpiresAt)
  )
}
