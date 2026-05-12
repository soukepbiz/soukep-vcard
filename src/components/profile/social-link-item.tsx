'use client'

import type { SocialLink } from '@/types/profile'
import { BRAND_PATHS } from '@/lib/brand-icons'
import { ExternalLink, Globe } from 'lucide-react'

const PLATFORM_COLORS: Record<string, string> = {
  linkedin: '#0A66C2', instagram: '#E1306C', tiktok: '#010101',
  youtube: '#FF0000', facebook: '#1877F2', twitter: '#000000',
  telegram: '#26A5E4', whatsapp: '#25D366', github: '#181717',
  snapchat: '#FFC300', pinterest: '#BD081C', discord: '#5865F2',
  twitch: '#9146FF', spotify: '#1DB954',
}

interface SocialLinkItemProps {
  link: SocialLink
  accentColor: string
}

export function SocialLinkItem({ link, accentColor }: SocialLinkItemProps) {
  const slug = link.platform.toLowerCase()
  const color = PLATFORM_COLORS[slug] || accentColor
  const path = BRAND_PATHS[slug]
  const isWebsite = slug === 'website' || slug === 'custom'

  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer"
      className="group flex items-center gap-3.5 w-full px-4 py-3.5 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md active:scale-[0.99] transition-all duration-200">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}15` }}>
        {isWebsite ? (
          <Globe className="w-5 h-5" style={{ color }} strokeWidth={1.8} />
        ) : path ? (
          <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ fill: color }}>
            <path d={path} />
          </svg>
        ) : (
          <ExternalLink className="w-5 h-5" style={{ color }} />
        )}
      </div>
      <span className="text-sm font-semibold text-gray-800 flex-1">{link.title}</span>
      <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-400 transition-colors flex-shrink-0" />
    </a>
  )
}
