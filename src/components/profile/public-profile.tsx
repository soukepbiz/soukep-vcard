'use client'

import { motion } from 'framer-motion'
import { ProfileHeader } from './profile-header'
import { SocialLinkItem } from './social-link-item'
import { AddContactFab } from './add-contact-fab'
import { BrandingFooter } from './branding-footer'
import type { Profile } from '@/types/profile'
import { MapPin, Briefcase, Building2 } from 'lucide-react'

interface PublicProfileProps {
  profile: Profile
  showBranding: boolean
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

export function PublicProfile({ profile, showBranding }: PublicProfileProps) {
  const accentColor = profile.accent_color || '#6366F1'

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-md mx-auto">
        <ProfileHeader profile={profile} />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="px-4 mt-16 flex flex-col gap-4"
        >
          {/* Identity */}
          <motion.div variants={item} className="text-center">
            {profile.full_name && (
              <h1 className="text-2xl font-bold text-gray-900">{profile.full_name}</h1>
            )}
            <div className="flex items-center justify-center gap-2 flex-wrap mt-1.5">
              {profile.job_title && (
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <Briefcase className="w-3.5 h-3.5" />
                  {profile.job_title}
                </span>
              )}
              {profile.company && (
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <Building2 className="w-3.5 h-3.5" />
                  {profile.company}
                </span>
              )}
            </div>
            {profile.location && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-1">
                <MapPin className="w-3 h-3" />
                {profile.location}
              </span>
            )}
            {profile.bio && (
              <p className="text-sm text-gray-500 mt-3 leading-relaxed max-w-xs mx-auto">
                {profile.bio}
              </p>
            )}
          </motion.div>

          {/* Phone numbers */}
          {profile.phone_numbers.filter((p) => p.number).length > 0 && (
            <motion.div variants={item} className="flex flex-col gap-2">
              {profile.phone_numbers.filter((p) => p.number).map((phone) => (
                <a
                  key={phone.id}
                  href={`tel:${phone.number}`}
                  className="flex items-center gap-3 w-full px-4 py-3 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${accentColor}15` }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke={accentColor} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{phone.label}</p>
                    <p className="text-sm font-medium text-gray-800">{phone.number}</p>
                  </div>
                </a>
              ))}
            </motion.div>
          )}

          {/* Social links */}
          {profile.social_links.length > 0 && (
            <motion.div variants={item} className="flex flex-col gap-2">
              {profile.social_links
                .sort((a, b) => a.order - b.order)
                .map((link) => (
                  <SocialLinkItem key={link.id} link={link} accentColor={accentColor} />
                ))}
            </motion.div>
          )}

          {showBranding && <motion.div variants={item}><BrandingFooter /></motion.div>}
        </motion.div>
      </div>

      <AddContactFab username={profile.username} accentColor={accentColor} />
    </div>
  )
}
