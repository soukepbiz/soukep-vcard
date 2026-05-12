'use client'

import { motion } from 'framer-motion'
import { ProfileHeader } from './profile-header'
import { AddContactFab } from './add-contact-fab'
import { BrandingFooter } from './branding-footer'
import type { Profile } from '@/types/profile'
import { MapPin, Briefcase, Building2, Phone, Mail } from 'lucide-react'
import { BRAND_PATHS, getContrastColor, resolveAccent } from '@/lib/brand-icons'

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
  const slug = platform.toLowerCase() === 'twitter' ? 'twitter' : platform.toLowerCase()
  const path = BRAND_PATHS[slug]
  if (path) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} style={{ fill: color }} xmlns="http://www.w3.org/2000/svg">
        <path d={path} />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2} xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  )
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

export function PublicProfile({ profile, showBranding }: PublicProfileProps) {
  const accent = resolveAccent(profile.accent_color)
  const contrastText = getContrastColor(accent)
  const phones = profile.phone_numbers.filter((p) => p.number)
  const emails = (profile.emails || []).filter((e) => e.email)
  const links = [...profile.social_links].sort((a, b) => a.order - b.order)

  // Quick-action circles: phone + email + first 3 social links
  type QuickAction = { key: string; href: string; bg: string; icon: React.ReactNode; label: string }
  const quickActions: QuickAction[] = []

  if (phones[0]) quickActions.push({
    key: 'phone', href: `tel:${phones[0].number}`, bg: accent,
    icon: <Phone size={22} color={contrastText} strokeWidth={2.5} />,
    label: 'Appeler',
  })
  if (emails[0]) quickActions.push({
    key: 'email', href: `mailto:${emails[0].email}`, bg: accent,
    icon: <Mail size={22} color={contrastText} strokeWidth={2.5} />,
    label: 'Email',
  })
  links.slice(0, 3).forEach((link) => {
    const slug = link.platform.toLowerCase()
    const bg = PLATFORM_COLORS[slug] || accent
    quickActions.push({
      key: link.id, href: link.url, bg,
      icon: <BrandIcon platform={slug} color={getContrastColor(bg)} size={22} />,
      label: link.title,
    })
  })

  return (
    <div className="min-h-screen pb-32 bg-[#F4F6F9]">
      <div className="max-w-md mx-auto bg-white shadow-sm min-h-screen">
        <ProfileHeader profile={profile} />

        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col pt-16">

          {/* Identity */}
          <motion.div variants={item} className="text-center px-6 pb-5">
            {profile.full_name && (
              <h1 className="text-[26px] font-extrabold text-gray-900 leading-tight">{profile.full_name}</h1>
            )}
            {profile.job_title && (
              <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-gray-500 mt-1">
                <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />{profile.job_title}
              </p>
            )}
            {profile.company && (
              <p className="flex items-center justify-center gap-1.5 text-sm text-gray-400 mt-0.5">
                <Building2 className="w-3.5 h-3.5 flex-shrink-0" />{profile.company}
              </p>
            )}
          </motion.div>

          {/* Quick action circles */}
          {quickActions.length > 0 && (
            <motion.div variants={item} className="flex items-start justify-center gap-5 px-6 pb-6 flex-wrap">
              {quickActions.map((a) => (
                <a key={a.key} href={a.href} target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 group">
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
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">À propos</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{profile.bio}</p>
            </motion.div>
          )}

          {/* Location — prominent */}
          {profile.location && (
            <motion.div variants={item} className="px-5 pb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: accent }} />
              <span className="text-sm font-semibold text-gray-700">{profile.location}</span>
            </motion.div>
          )}

          {(profile.bio || profile.location) && <div className="h-2.5 bg-[#F4F6F9]" />}

          {/* All links — icon + label grid, no circles */}
          {(phones.length > 0 || emails.length > 0 || links.length > 0) && (
            <motion.div variants={item} className="px-5 py-5">
              <div className="grid grid-cols-4 gap-x-3 gap-y-5">
                {phones.map((phone) => (
                  <a key={phone.id} href={`tel:${phone.number}`} target="_blank" rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 group active:scale-95 transition-transform">
                    <Phone size={28} style={{ color: accent }} strokeWidth={1.8} />
                    <span className="text-[11px] text-gray-500 font-medium text-center leading-tight">{phone.label}</span>
                  </a>
                ))}
                {emails.map((em) => (
                  <a key={em.id} href={`mailto:${em.email}`} target="_blank" rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 group active:scale-95 transition-transform">
                    <Mail size={28} style={{ color: accent }} strokeWidth={1.8} />
                    <span className="text-[11px] text-gray-500 font-medium text-center leading-tight">{em.label}</span>
                  </a>
                ))}
                {links.map((link) => {
                  const slug = link.platform.toLowerCase()
                  const color = PLATFORM_COLORS[slug] || accent
                  return (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1.5 group active:scale-95 transition-transform">
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

      <AddContactFab username={profile.username} accentColor={accent} contrastColor={contrastText} />
    </div>
  )
}
