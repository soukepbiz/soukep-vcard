import type { Profile } from '@/types/profile'

function escapeVCard(str: string): string {
  return str.replace(/[,;\\]/g, (c) => `\\${c}`).replace(/\n/g, '\\n')
}

const NATIVE_SCHEMES: Record<string, (identifier: string) => string> = {
  facebook: (id) => `fb://profile/${id}`,
  instagram: (id) => `instagram://user?username=${id}`,
  tiktok: (id) => `tiktok://user/@${id}`,
  snapchat: (id) => `snapchat://add/${id}`,
  linkedin: (url) => url.includes('linkedin.com') ? url : `https://linkedin.com/in/${url}`,
  twitter: (id) => `https://x.com/${id}`,
  whatsapp: (number) => `https://wa.me/${number}`,
  telegram: (id) => `https://t.me/${id}`,
  youtube: (channel) => `https://youtube.com/@${channel}`,
  github: (username) => `https://github.com/${username}`,
  spotify: (artist) => `spotify:artist:${artist}`,
  twitch: (channel) => `https://twitch.tv/${channel}`,
  pinterest: (username) => `https://pinterest.com/${username}`,
  discord: (server) => `https://discord.gg/${server}`,
}

function getNativeUrl(platform: string, url: string): string {
  const platformLower = platform.toLowerCase()
  if (!NATIVE_SCHEMES[platformLower]) return url

  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    let identifier = pathname.replace(/^\//, '').split('/')[0]

    if (identifier) {
      return NATIVE_SCHEMES[platformLower](identifier)
    }
  } catch {
    // Fallback to original URL if parsing fails
  }

  return url
}

export async function generateVCard(profile: Profile): Promise<string> {
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0']

  const firstName = profile.first_name || (profile.full_name ? profile.full_name.split(' ').slice(0, -1).join(' ') : '')
  const lastName = profile.last_name || (profile.full_name ? profile.full_name.split(' ').pop() || '' : '')
  const displayName = [firstName, lastName].filter(Boolean).join(' ') || profile.full_name

  if (displayName) {
    lines.push(`FN:${escapeVCard(displayName)}`)
    lines.push(`N:${escapeVCard(lastName)};${escapeVCard(firstName)};;;`)
  }

  if (profile.job_title) lines.push(`TITLE:${escapeVCard(profile.job_title)}`)
  if (profile.company) lines.push(`ORG:${escapeVCard(profile.company)}`)
  if (profile.bio) lines.push(`NOTE:${escapeVCard(profile.bio)}`)
  if (profile.location) lines.push(`ADR;TYPE=WORK:;;${escapeVCard(profile.location)};;;;`)

  for (const phone of profile.phone_numbers) {
    if (phone.number) {
      const type = phone.label?.toLowerCase().includes('perso') ? 'HOME' : 'WORK'
      lines.push(`TEL;TYPE=${type}:${phone.number}`)
    }
  }

  for (const email of profile.emails) {
    if (email.email) {
      lines.push(`EMAIL:${email.email}`)
    }
  }

  // Avatar as base64
  if (profile.avatar_url) {
    try {
      const res = await fetch(profile.avatar_url)
      if (res.ok) {
        const buffer = await res.arrayBuffer()
        const base64 = Buffer.from(buffer).toString('base64')
        const contentType = res.headers.get('content-type') || 'image/jpeg'
        const photoType = contentType.includes('png') ? 'PNG' : 'JPEG'
        lines.push(`PHOTO;ENCODING=b;TYPE=${photoType}:${base64}`)
      }
    } catch {
      // Skip photo if fetch fails
    }
  }

  // Social links — use native schemes for iOS/Android and standard URLs as fallback
  for (const link of profile.social_links) {
    if (link.url) {
      const nativeUrl = getNativeUrl(link.platform, link.url)
      lines.push(`URL;TYPE=${escapeVCard(link.platform.toUpperCase())}:${nativeUrl}`)
    }
  }

  lines.push('END:VCARD')

  return lines.join('\r\n')
}
