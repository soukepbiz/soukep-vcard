import Image from 'next/image'
import type { Profile } from '@/types/profile'

interface ProfileHeaderProps {
  profile: Profile
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const accentColor = profile.accent_color || '#6366F1'

  return (
    <div className="relative pb-4">
      {/* Cover */}
      <div className="h-40 w-full overflow-hidden bg-gradient-to-r from-[#E6F4FF] to-[#B3DBFF] rounded-b-3xl"
        style={profile.cover_url ? undefined : { background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}60)` }}
      >
        {profile.cover_url && (
          <Image
            src={profile.cover_url}
            alt="Bannière"
            fill
            className="object-cover rounded-b-3xl"
            priority
            sizes="100vw"
          />
        )}
      </div>

      {/* Avatar overlapping cover */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-0 translate-y-1/2">
        <div
          className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100"
        >
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.full_name || profile.username}
              width={96}
              height={96}
              className="object-cover w-full h-full"
              priority
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-2xl font-bold text-white"
              style={{ backgroundColor: accentColor }}
            >
              {(profile.full_name || profile.username)[0]?.toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
