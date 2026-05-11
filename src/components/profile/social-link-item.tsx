'use client'

import { ExternalLink } from 'lucide-react'
import type { SocialLink } from '@/types/profile'

// Mapping platform → simple-icons slug
const PLATFORM_ICONS: Record<string, string> = {
  linkedin: 'linkedin',
  instagram: 'instagram',
  tiktok: 'tiktok',
  youtube: 'youtube',
  facebook: 'facebook',
  twitter: 'x',
  telegram: 'telegram',
  whatsapp: 'whatsapp',
  github: 'github',
  snapchat: 'snapchat',
  pinterest: 'pinterest',
  discord: 'discord',
  twitch: 'twitch',
  spotify: 'spotify',
}

interface SocialLinkItemProps {
  link: SocialLink
  accentColor: string
}

export function SocialLinkItem({ link, accentColor }: SocialLinkItemProps) {
  const iconSlug = PLATFORM_ICONS[link.platform.toLowerCase()]

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 w-full px-4 py-3 bg-white rounded-2xl border border-gray-100 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${accentColor}15` }}
      >
        {iconSlug ? (
          <svg
            role="img"
            viewBox="0 0 24 24"
            className="w-5 h-5"
            style={{ fill: accentColor }}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* SVG path loaded dynamically via CSS mask trick or inline */}
            <use href={`/icons/simple-icons.svg#${iconSlug}`} />
          </svg>
        ) : (
          <ExternalLink className="w-5 h-5" style={{ color: accentColor }} />
        )}
      </div>
      <span className="text-sm font-medium text-gray-800">{link.title}</span>
      <ExternalLink className="w-3.5 h-3.5 text-gray-300 ml-auto flex-shrink-0" />
    </a>
  )
}
