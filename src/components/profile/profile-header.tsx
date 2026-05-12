import Image from 'next/image'
import type { Profile } from '@/types/profile'

interface ProfileHeaderProps {
  profile: Profile
}

// Normalize legacy purple to brand blue
function resolveAccent(color: string | null) {
  if (!color || color === '#6366F1') return '#0099FF'
  return color
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const accent = resolveAccent(profile.accent_color)

  return (
    <div className="relative">
      {/* Cover — top full-width, only bottom corners rounded */}
      <div
        className="h-44 w-full overflow-hidden rounded-b-3xl relative"
        style={
          profile.cover_url
            ? undefined
            : { background: `linear-gradient(135deg, ${accent} 0%, ${accent}99 50%, ${accent}44 100%)` }
        }
      >
        {profile.cover_url && (
          <Image
            src={profile.cover_url}
            alt="Bannière"
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 768px) 100vw, 448px"
          />
        )}
        <div className="absolute inset-0 rounded-b-3xl bg-gradient-to-t from-black/15 to-transparent" />
      </div>

      {/* Avatar overlapping cover */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2">
        <div
          className="w-28 h-28 rounded-full overflow-hidden bg-gray-100"
          style={{ border: '4px solid white', boxShadow: `0 4px 24px rgba(0,0,0,0.15), 0 0 0 2px ${accent}40` }}
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
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}BB)` }}
            >
              {(profile.first_name || profile.full_name || profile.username)[0]?.toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
