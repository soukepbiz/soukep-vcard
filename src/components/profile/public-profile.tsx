'use client'

import { motion } from 'framer-motion'
import { ProfileHeader } from './profile-header'
import { AddContactFab } from './add-contact-fab'
import { BrandingFooter } from './branding-footer'
import type { Profile } from '@/types/profile'
import { MapPin, Briefcase, Building2, Phone, Mail, Globe } from 'lucide-react'
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

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

// Subtle dot pattern SVG for background
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

export function PublicProfile({ profile, showBranding }: PublicProfileProps) {
  const accent = resolveAccent(profile.accent_color)
  const phones = profile.phone_numbers.filter((p) => p.number)
  const emails = Array.isArray(profile.emails) ? profile.emails.filter((e) => e.email) : []
  const links = [...profile.social_links].sort((a, b) => a.order - b.order)

  type QuickAction = { key: string; href: string; bg: string; icon: React.ReactNode; label: string }
  const quickActions: QuickAction[] = []

  if (phones[0]) quickActions.push({
    key: 'phone', href: `tel:${phones[0].number}`, bg: accent,
    icon: <Phone size={22} color="#FFFFFF" strokeWidth={2.5} />, label: 'Appeler',
  })
  if (emails[0]) quickActions.push({
    key: 'email', href: `mailto:${emails[0].email}`, bg: accent,
    icon: <Mail size={22} color="#FFFFFF" strokeWidth={2.5} />, label: 'Email',
  })
  links.slice(0, 3).forEach((link) => {
    const slug = link.platform.toLowerCase()
    const bg = PLATFORM_COLORS[slug] || accent
    quickActions.push({
      key: link.id, href: link.url, bg,
      icon: <BrandIcon platform={slug} color="#FFFFFF" size={22} />, label: link.title,
    })
  })

  const hasGrid = phones.length > 0 || emails.length > 0 || links.length > 0

  return (
    <div className="min-h-screen pb-32 relative overflow-hidden" style={{ backgroundColor: '#F4F6F9' }}>
      <BgPattern accent={accent} />
      <div className="relative max-w-md mx-auto bg-white shadow-sm min-h-screen">
        <ProfileHeader profile={profile} />

        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col pt-16">

          {/* Identity */}
          <motion.div variants={item} className="text-center px-6 pb-5 pt-2">
            {profile.full_name && (
              <h1 className="text-[26px] font-extrabold text-gray-900 leading-tight">{profile.full_name}</h1>
            )}
            {profile.job_title && (
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: accent }}
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
            <motion.div variants={item} className="flex items-start justify-center gap-5 px-6 pb-6 flex-wrap">
              {quickActions.map((a) => (
                <a key={a.key} href={a.href} target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform"
                    style={{ backgroundColor: a.bg }}>
                    {a.icon}
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium">{a.label}</span>
                </a>
              ))}
            </motion.div>
          )}

          <div className="h-2.5 bg-[#F4F6F9]" />

          {/* Bio */}
          {profile.bio && (
            <motion.div variants={item} className="px-5 py-4">
              <h3 className="text-base font-bold text-gray-900 mb-2">À propos</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{profile.bio}</p>
            </motion.div>
          )}

          {profile.bio && profile.location && <div className="h-px bg-gray-100 mx-5" />}

          {/* Location — standalone section */}
          {profile.location && (
            <motion.div variants={item} className="px-5 py-4">
              <h3 className="text-base font-bold text-gray-900 mb-2">Localisation</h3>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: accent }} />
                <span className="text-base font-semibold text-gray-700">{profile.location}</span>
              </div>
            </motion.div>
          )}

          {(profile.bio || profile.location) && <div className="h-2.5 bg-[#F4F6F9]" />}

          {/* All contacts + links grid — no circles, just icons + labels */}
          {hasGrid && (
            <motion.div variants={item} className="px-5 py-5">
              <div className="grid grid-cols-4 gap-x-3 gap-y-5">
                {phones.map((phone) => (
                  <a key={phone.id} href={`tel:${phone.number}`} target="_blank" rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
                    <Phone size={28} style={{ color: accent }} strokeWidth={1.8} />
                    <span className="text-[11px] text-gray-500 font-medium text-center leading-tight">{phone.label}</span>
                  </a>
                ))}
                {emails.map((em) => (
                  <a key={em.id} href={`mailto:${em.email}`} target="_blank" rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
                    <Mail size={28} style={{ color: accent }} strokeWidth={1.8} />
                    <span className="text-[11px] text-gray-500 font-medium text-center leading-tight">{em.label}</span>
                  </a>
                ))}
                {links.map((link) => {
                  const slug = link.platform.toLowerCase()
                  const color = PLATFORM_COLORS[slug] || accent
                  return (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
                      <BrandIcon platform={slug} color={color} size={28} />
                      <span className="text-[11px] text-gray-500 font-medium text-center leading-tight">{link.title}</span>
                    </a>
                  )
                })}
              </div>
            </motion.div>
          )}

          {showBranding && (
            <>
              <div className="h-2.5 bg-[#F4F6F9]" />
              <motion.div variants={item} className="px-5 py-4">
                <BrandingFooter />
              </motion.div>
            </>
          )}
        </motion.div>
      </div>

      <AddContactFab username={profile.username} accentColor={accent} />
    </div>
  )
}
