'use client'

import { motion } from 'framer-motion'
import { ProfileHeader } from './profile-header'
import { SocialLinkItem } from './social-link-item'
import { AddContactFab } from './add-contact-fab'
import { BrandingFooter } from './branding-footer'
import type { Profile } from '@/types/profile'
import { MapPin, Briefcase, Building2, Phone } from 'lucide-react'

interface PublicProfileProps {
  profile: Profile
  showBranding: boolean
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export function PublicProfile({ profile, showBranding }: PublicProfileProps) {
  const accent = profile.accent_color || '#0099FF'
  const phones = profile.phone_numbers.filter((p) => p.number)
  const links = [...profile.social_links].sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen pb-32" style={{ backgroundColor: '#F7F8FA' }}>
      <div className="max-w-md mx-auto">
        {/* Header: cover + avatar */}
        <ProfileHeader profile={profile} />

        {/* Content starts below avatar */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-3 px-4 pt-20"
        >
          {/* Identity card */}
          <motion.div variants={item} className="text-center pb-2">
            {profile.full_name && (
              <h1 className="text-[26px] font-extrabold text-gray-900 leading-tight tracking-tight">
                {profile.full_name}
              </h1>
            )}

            {(profile.job_title || profile.company) && (
              <div className="flex items-center justify-center gap-2 flex-wrap mt-1.5">
                {profile.job_title && (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-500">
                    <Briefcase className="w-3.5 h-3.5" />
                    {profile.job_title}
                  </span>
                )}
                {profile.job_title && profile.company && (
                  <span className="text-gray-300 text-xs">•</span>
                )}
                {profile.company && (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-500">
                    <Building2 className="w-3.5 h-3.5" />
                    {profile.company}
                  </span>
                )}
              </div>
            )}

            {profile.location && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-1.5">
                <MapPin className="w-3 h-3" />
                {profile.location}
              </span>
            )}

            {profile.bio && (
              <p className="text-sm text-gray-500 mt-3 leading-relaxed max-w-[280px] mx-auto">
                {profile.bio}
              </p>
            )}
          </motion.div>

          {/* Phone numbers */}
          {phones.length > 0 && (
            <motion.div variants={item} className="flex flex-col gap-2">
              {phones.map((phone) => (
                <a
                  key={phone.id}
                  href={`tel:${phone.number}`}
                  className="group flex items-center gap-3.5 w-full px-4 py-3.5 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md active:scale-[0.99] transition-all duration-200"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${accent}15` }}
                  >
                    <Phone className="w-5 h-5" style={{ color: accent }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">{phone.label}</p>
                    <p className="text-sm font-semibold text-gray-800">{phone.number}</p>
                  </div>
                </a>
              ))}
            </motion.div>
          )}

          {/* Social links */}
          {links.length > 0 && (
            <motion.div variants={item} className="flex flex-col gap-2">
              {links.map((link) => (
                <SocialLinkItem key={link.id} link={link} accentColor={accent} />
              ))}
            </motion.div>
          )}

          {showBranding && (
            <motion.div variants={item}>
              <BrandingFooter />
            </motion.div>
          )}
        </motion.div>
      </div>

      <AddContactFab username={profile.username} accentColor={accent} />
    </div>
  )
}
