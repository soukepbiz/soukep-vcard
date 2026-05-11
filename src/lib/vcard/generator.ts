import type { Profile } from '@/types/profile'

function escapeVCard(str: string): string {
  return str.replace(/[,;\\]/g, (c) => `\\${c}`).replace(/\n/g, '\\n')
}

export async function generateVCard(profile: Profile): Promise<string> {
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0']

  if (profile.full_name) {
    lines.push(`FN:${escapeVCard(profile.full_name)}`)
    const parts = profile.full_name.split(' ')
    const last = parts.pop() || ''
    const first = parts.join(' ')
    lines.push(`N:${escapeVCard(last)};${escapeVCard(first)};;;`)
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

  // Social links — use URL fields + include in NOTE
  const socialNotes: string[] = []
  for (const link of profile.social_links) {
    if (link.url) {
      lines.push(`URL;TYPE=${escapeVCard(link.platform.toUpperCase())}:${link.url}`)
      socialNotes.push(`${link.title}: ${link.url}`)
    }
  }

  if (socialNotes.length > 0) {
    const existingNote = lines.find((l) => l.startsWith('NOTE:'))
    if (existingNote) {
      const idx = lines.indexOf(existingNote)
      lines[idx] = `${existingNote}\\n---\\n${socialNotes.join('\\n')}`
    } else {
      lines.push(`NOTE:${socialNotes.join('\\n')}`)
    }
  }

  lines.push(`X-SOCIALPROFILE;USERNAME=${profile.username}:vcard.soukep.com/${profile.username}`)
  lines.push('END:VCARD')

  return lines.join('\r\n')
}
