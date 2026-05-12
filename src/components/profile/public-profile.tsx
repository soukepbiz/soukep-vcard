'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ProfileHeader } from './profile-header'
import { AddContactFab } from './add-contact-fab'
import { BrandingFooter } from './branding-footer'
import type { Profile } from '@/types/profile'
import { MapPin, Briefcase, Building2, Phone, Mail, Globe, LayoutGrid, List, Copy, Check } from 'lucide-react'
import { BRAND_PATHS, resolveAccent } from '@/lib/brand-icons'

interface PublicProfileProps {
  profile: Profile
  showBranding: boolean
}

const PLATFORM_COLORS: Record<string, string> = {
  linkedin: '#0A66C2', instagram: '#E1306C', tiktok: '#010101',
  youtube: '#FF0000', facebook: '#1877F2', twitter: '#000000',
  telegram: '#26A5E4', whatsapp: '#25D366', github: '#181717',
  snapchat: '#FFC300', pinterest: '#BD081C', discord: '#5865F2',
  twitch: '#9146FF', spotify: '#1DB954',
}

function BrandIcon({ platform, color, size = 24 }: { platform: string; color: string; size?: number }) {
  const slug = platform.toLowerCase()
  if (slug === 'website' || slug === 'custom') return <Globe width={size} height={size} color={color} strokeWidth={1.8} />
  const path = BRAND_PATHS[slug]
  if (path) return <svg viewBox="0 0 24 24" width={size} height={size} style={{ fill: color }}><path d={path} /></svg>
  return <Globe width={size} height={size} color={color} strokeWidth={1.8} />
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function handleCopy(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
    >
      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
    </button>
  )
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

const BgPattern = ({ accent }: { accent: string }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill={accent} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
)

function normalizeUrl(url: string): string {
  if (!url) return url
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('tel:') || url.startsWith('mailto:')) return url
  return `https://${url}`
}

export function PublicProfile({ profile, showBranding }: PublicProfileProps) {
  const accent = resolveAccent(profile.accent_color)
  const textColor = profile.text_color || '#FFFFFF'
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  useEffect(() => {
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#FFFFFF'
    document.documentElement.style.backgroundColor = '#FFFFFF'
    return () => {
      document.body.style.backgroundColor = prev
      document.documentElement.style.backgroundColor = ''
    }
  }, [])

  const phones = profile.phone_numbers.filter((p) => p.number)
  const emails = Array.isArray(profile.emails) ? profile.emails.filter((e) => e.email) : []
  const links = [...profile.social_links].sort((a, b) => a.order - b.order)

  type QuickAction = { key: string; href: string; bg: string; icon: React.ReactNode; label: string }
  const quickActions: QuickAction[] = []

  if (phones[0]) quickActions.push({
    key: 'phone', href: `tel:${phones[0].number}`, bg: accent,
    icon: <Phone size={18} color={textColor} strokeWidth={2.5} />, label: 'Appeler',
  })
  if (emails[0]) quickActions.push({
    key: 'email', href: `mailto:${emails[0].email}`, bg: accent,
    icon: <Mail size={18} color={textColor} strokeWidth={2.5} />, label: 'Email',
  })
  links.slice(0, 3).forEach((link) => {
    const slug = link.platform.toLowerCase()
    const bg = PLATFORM_COLORS[slug] || accent
    quickActions.push({
      key: link.id, href: normalizeUrl(link.url), bg,
      icon: <BrandIcon platform={slug} color={textColor} size={18} />, label: link.title,
    })
  })

  const hasContacts = phones.length > 0 || emails.length > 0 || links.length > 0

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#FFFFFF' }}>
      <BgPattern accent={accent} />
      <div className="relative max-w-md mx-auto bg-white min-h-screen">
        <ProfileHeader profile={profile} />

        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col pt-14 pb-28">

          {/* Identity */}
          <motion.div variants={item} className="text-center px-6 pb-3 pt-1">
            {(profile.first_name || profile.last_name || profile.full_name) && (
              <h1 className="text-[26px] font-extrabold text-gray-900 leading-tight">
                {profile.first_name || profile.last_name
                  ? [profile.first_name, profile.last_name].filter(Boolean).join(' ')
                  : profile.full_name}
              </h1>
            )}
            {profile.job_title && (
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: accent, color: textColor }}
                >
                  <Briefcase className="w-3 h-3 flex-shrink-0" />
                  {profile.job_title}
                </span>
              </div>
            )}
            {profile.company && (
              <p className="flex items-center justify-center gap-1.5 text-base font-bold text-gray-800 mt-2">
                <Building2 className="w-4 h-4 flex-shrink-0" style={{ color: accent }} />
                {profile.company}
              </p>
            )}
          </motion.div>

          {/* Quick action circles */}
          {quickActions.length > 0 && (
            <motion.div variants={item} className="flex items-start justify-center gap-2.5 px-4 pb-3 flex-nowrap overflow-x-auto">
              {quickActions.map((a) => (
                <a key={a.key} href={a.href} target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform"
                    style={{ backgroundColor: a.bg }}>
                    {a.icon}
                  </div>
                  <span className="text-xs text-gray-500 font-medium whitespace-nowrap">{a.label}</span>
                </a>
              ))}
            </motion.div>
          )}

          {/* Bio */}
          {profile.bio && (
            <motion.div variants={item} className="px-5 pt-4 pb-4">
              <h3 className="text-base font-bold text-gray-900 mb-2">{profile.bio_title || 'À propos'}</h3>
              <p className="text-base text-gray-700 leading-relaxed">{profile.bio}</p>
            </motion.div>
          )}

          {/* Location */}
          {profile.location && (
            <motion.div variants={item} className={`px-5 flex items-center gap-2 ${profile.bio ? 'pt-0 pb-4' : 'py-4'}`}>
              <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: accent }} />
              <span className="text-base font-semibold text-gray-700">{profile.location}</span>
            </motion.div>
          )}

          {/* Contacts & links — toggle grille/liste */}
          {hasContacts && (
            <motion.div variants={item} className="px-5 pb-5">
              {/* Toggle */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-600">Contacts & liens</span>
                <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-700' : 'text-gray-400'}`}
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-700' : 'text-gray-400'}`}
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>

              {/* Vue grille */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-5 gap-x-2 gap-y-4">
                  {phones.map((phone, i) => (
                    <a key={phone.id ?? `phone-${i}`} href={`tel:${phone.number}`} target="_blank" rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
                      <Phone size={28} style={{ color: accent }} strokeWidth={1.8} />
                      <span className="text-xs text-gray-500 font-medium text-center leading-tight">{phone.label}</span>
                    </a>
                  ))}
                  {emails.map((em, i) => (
                    <a key={em.id ?? `email-${i}`} href={`mailto:${em.email}`} target="_blank" rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
                      <Mail size={28} style={{ color: accent }} strokeWidth={1.8} />
                      <span className="text-xs text-gray-500 font-medium text-center leading-tight">{em.label}</span>
                    </a>
                  ))}
                  {links.map((link, i) => {
                    const slug = link.platform.toLowerCase()
                    const color = PLATFORM_COLORS[slug] || accent
                    return (
                      <a key={link.id ?? `link-${i}`} href={normalizeUrl(link.url)} target="_blank" rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
                        <BrandIcon platform={slug} color={color} size={28} />
                        <span className="text-xs text-gray-500 font-medium text-center leading-tight">{link.title}</span>
                      </a>
                    )
                  })}
                </div>
              )}

              {/* Vue liste */}
              {viewMode === 'list' && (
                <div className="flex flex-col divide-y divide-gray-100">
                  {phones.map((phone, i) => (
                    <div key={phone.id ?? `phone-${i}`} className="flex items-center gap-3 py-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accent}18` }}>
                        <Phone size={18} style={{ color: accent }} strokeWidth={1.8} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 font-medium truncate">{phone.label}</p>
                        <a href={`tel:${phone.number}`} className="text-sm font-semibold text-gray-800 truncate block hover:underline">
                          {phone.number}
                        </a>
                      </div>
                      <CopyButton text={phone.number} />
                    </div>
                  ))}
                  {emails.map((em, i) => (
                    <div key={em.id ?? `email-${i}`} className="flex items-center gap-3 py-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accent}18` }}>
                        <Mail size={18} style={{ color: accent }} strokeWidth={1.8} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 font-medium truncate">{em.label}</p>
                        <a href={`mailto:${em.email}`} className="text-sm font-semibold text-gray-800 truncate block hover:underline">
                          {em.email}
                        </a>
                      </div>
                      <CopyButton text={em.email} />
                    </div>
                  ))}
                  {links.map((link, i) => {
                    const slug = link.platform.toLowerCase()
                    const color = PLATFORM_COLORS[slug] || accent
                    return (
                      <div key={link.id ?? `link-${i}`} className="flex items-center gap-3 py-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18` }}>
                          <BrandIcon platform={slug} color={color} size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 font-medium truncate">{link.title}</p>
                          <a href={normalizeUrl(link.url)} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-800 truncate block hover:underline">
                            {link.url.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                        <CopyButton text={link.url} />
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}

        </motion.div>

        {showBranding && <div className="mt-4 mb-2"><BrandingFooter /></div>}
      </div>

      <AddContactFab username={profile.username} accentColor={accent} contrastColor={textColor} />
    </div>
  )
}
