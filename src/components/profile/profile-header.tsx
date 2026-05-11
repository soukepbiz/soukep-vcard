import Image from 'next/image'
import type { Profile } from '@/types/profile'

interface ProfileHeaderProps {
  profile: Profile
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const accent = profile.accent_color || '#0099FF'

  return (
    <div className="relative">
      {/* Cover */}
      <div
        className="h-48 w-full overflow-hidden"
        style={
          profile.cover_url
            ? undefined
            : { background: `linear-gradient(135deg, ${accent}CC 0%, ${accent}66 50%, ${accent}22 100%)` }
        }
      >
        {profile.cover_url && (
          <Image
            src={profile.cover_url}
            alt="Bannière"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        {/* Gradient overlay bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Avatar */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2">
        <div
          className="w-28 h-28 rounded-full overflow-hidden border-[3px] border-white shadow-xl bg-gray-100"
          style={{ boxShadow: `0 0 0 3px white, 0 8px 32px ${accent}40` }}
        >
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.full_name || profile.username}
              width={112}
              height={112}
              className="object-cover w-full h-full"
              priority
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-3xl font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}CC)` }}
            >
              {(profile.full_name || profile.username)[0]?.toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
