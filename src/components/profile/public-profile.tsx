'use client'

import { motion } from 'framer-motion'
import { ProfileHeader } from './profile-header'
import { AddContactFab } from './add-contact-fab'
import { BrandingFooter } from './branding-footer'
import type { Profile } from '@/types/profile'
import { MapPin, Briefcase, Building2, Phone, Mail, Globe, Link as LinkIcon } from 'lucide-react'

interface PublicProfileProps {
  profile: Profile
  showBranding: boolean
}

const PLATFORM_ICONS: Record<string, string> = {
  linkedin: 'linkedin', instagram: 'instagram', tiktok: 'tiktok',
  youtube: 'youtube', facebook: 'facebook', twitter: 'x',
  telegram: 'telegram', whatsapp: 'whatsapp', github: 'github',
  snapchat: 'snapchat', pinterest: 'pinterest', discord: 'discord',
  twitch: 'twitch', spotify: 'spotify',
}

const PLATFORM_COLORS: Record<string, string> = {
  linkedin: '#0A66C2', instagram: '#E1306C', tiktok: '#010101',
  youtube: '#FF0000', facebook: '#1877F2', twitter: '#000000',
  telegram: '#26A5E4', whatsapp: '#25D366', github: '#181717',
  snapchat: '#FFC300', pinterest: '#BD081C', discord: '#5865F2',
  twitch: '#9146FF', spotify: '#1DB954',
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

function PlatformIcon({ slug, color, size = 22 }: { slug: string; color: string; size?: number }) {
  if (PLATFORM_ICONS[slug]) {
    return (
      <svg role="img" viewBox="0 0 24 24" width={size} height={size} style={{ fill: color }} xmlns="http://www.w3.org/2000/svg">
        <use href={`/icons/simple-icons.svg#${PLATFORM_ICONS[slug]}`} />
      </svg>
    )
  }
  return <Globe width={size} height={size} color={color} />
}

export function PublicProfile({ profile, showBranding }: PublicProfileProps) {
  const raw = profile.accent_color
  const accent = (!raw || raw === '#6366F1') ? '#0099FF' : raw
  const phones = profile.phone_numbers.filter((p) => p.number)
  const links = [...profile.social_links].sort((a, b) => a.order - b.order)

  // Quick-action icons (phone + email + first 4 social links)
  const quickActions: { key: string; href: string; icon: React.ReactNode; color: string; label: string }[] = []

  if (phones[0]) {
    quickActions.push({
      key: 'phone',
      href: `tel:${phones[0].number}`,
      icon: <Phone size={22} color="white" strokeWidth={2} />,
      color: accent,
      label: 'Appeler',
    })
  }

  if (profile.emails?.[0]?.email) {
    quickActions.push({
      key: 'email',
      href: `mailto:${profile.emails[0].email}`,
      icon: <Mail size={22} color="white" strokeWidth={2} />,
      color: accent,
      label: 'Email',
    })
  }

  links.slice(0, 4).forEach((link) => {
    const slug = link.platform.toLowerCase()
    const color = PLATFORM_COLORS[slug] || accent
    quickActions.push({
      key: link.id,
      href: link.url,
      icon: <PlatformIcon slug={slug} color="white" size={22} />,
      color,
      label: link.title,
    })
  })

  // Remaining links (after the first 4 shown in quick actions)
  const remainingLinks = links.slice(quickActions.filter(q => !['phone','email'].includes(q.key)).length)

  return (
    <div className="min-h-screen pb-32 bg-[#F4F6F9]">
      <div className="max-w-md mx-auto bg-white shadow-sm min-h-screen">
        {/* Header: cover + avatar */}
        <ProfileHeader profile={profile} />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-0 pt-16"
        >
          {/* Identity */}
          <motion.div variants={item} className="text-center px-6 pb-4">
            {profile.full_name && (
              <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
                {profile.full_name}
              </h1>
            )}
            {profile.job_title && (
              <p className="text-sm font-medium text-gray-500 mt-0.5 flex items-center justify-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                {profile.job_title}
              </p>
            )}
            {profile.company && (
              <p className="text-sm text-gray-400 mt-0.5 flex items-center justify-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                {profile.company}
              </p>
            )}
          </motion.div>

          {/* Quick action circles */}
          {quickActions.length > 0 && (
            <motion.div variants={item} className="flex items-center justify-center gap-4 px-6 pb-5 flex-wrap">
              {quickActions.map((action) => (
                <a
                  key={action.key}
                  href={action.href}
                  target={action.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform"
                    style={{ backgroundColor: action.color }}
                  >
                    {action.icon}
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium">{action.label}</span>
                </a>
              ))}
            </motion.div>
          )}

          {/* Divider */}
          <div className="h-2 bg-[#F4F6F9]" />

          {/* Bio + location */}
          {(profile.bio || profile.location) && (
            <motion.div variants={item} className="px-5 py-4">
              {profile.bio && (
                <>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">À propos</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{profile.bio}</p>
                </>
              )}
              {profile.location && (
                <p className="text-sm text-gray-400 mt-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: accent }} />
                  {profile.location}
                </p>
              )}
            </motion.div>
          )}

          {/* Divider */}
          {(profile.bio || profile.location) && <div className="h-2 bg-[#F4F6F9]" />}

          {/* All links as icon grid */}
          {links.length > 0 && (
            <motion.div variants={item} className="px-5 py-4">
              <div className="grid grid-cols-4 gap-y-5">
                {phones.map((phone) => (
                  <a key={phone.id} href={`tel:${phone.number}`} className="flex flex-col items-center gap-1.5 group">
                    <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center group-active:scale-95 transition-transform">
                      <Phone size={22} style={{ color: accent }} strokeWidth={1.8} />
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium text-center leading-tight">{phone.label}</span>
                  </a>
                ))}
                {links.map((link) => {
                  const slug = link.platform.toLowerCase()
                  const color = PLATFORM_COLORS[slug] || accent
                  return (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 group">
                      <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center group-active:scale-95 transition-transform">
                        <PlatformIcon slug={slug} color={color} size={24} />
                      </div>
                      <span className="text-[11px] text-gray-500 font-medium text-center leading-tight">{link.title}</span>
                    </a>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Divider before branding */}
          {showBranding && <div className="h-2 bg-[#F4F6F9]" />}

          {showBranding && (
            <motion.div variants={item} className="px-5 py-4">
              <BrandingFooter />
            </motion.div>
          )}
        </motion.div>
      </div>

      <AddContactFab username={profile.username} accentColor={accent} />
    </div>
  )
}
