export const TIER_LIMITS = {
  free: {
    maxLinks: 5,
    customColors: false,
    analytics: false,
    branding: true,
  },
  premium: {
    maxLinks: Infinity,
    customColors: true,
    analytics: true,
    branding: false,
  },
  lifetime: {
    maxLinks: Infinity,
    customColors: true,
    analytics: true,
    branding: false,
  },
} as const

export const SOCIAL_PLATFORMS = [
  { id: 'linkedin', label: 'LinkedIn', icon: 'linkedin', color: '#0A66C2' },
  { id: 'instagram', label: 'Instagram', icon: 'instagram', color: '#E4405F' },
  { id: 'tiktok', label: 'TikTok', icon: 'tiktok', color: '#000000' },
  { id: 'youtube', label: 'YouTube', icon: 'youtube', color: '#FF0000' },
  { id: 'facebook', label: 'Facebook', icon: 'facebook', color: '#1877F2' },
  { id: 'twitter', label: 'X (Twitter)', icon: 'x', color: '#000000' },
  { id: 'telegram', label: 'Telegram', icon: 'telegram', color: '#26A5E4' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp', color: '#25D366' },
  { id: 'github', label: 'GitHub', icon: 'github', color: '#181717' },
  { id: 'website', label: 'Site Web', icon: 'globe', color: '#6366F1' },
  { id: 'custom', label: 'Lien personnalisé', icon: 'link', color: '#6B7280' },
] as const

export const DEFAULT_ACCENT_COLOR = '#6366F1'
