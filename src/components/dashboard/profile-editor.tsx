'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { AvatarUpload } from './avatar-upload'
import { CoverUpload } from './cover-upload'
import { SocialLinksEditor } from './social-links-editor'
import { ThemeEditor } from './theme-editor'
import { Button } from '@/components/ui/button'
import { useColorExtract } from '@/hooks/use-color-extract'
import { useSubscription } from '@/hooks/use-subscription'
import type { Profile, SocialLink } from '@/types/profile'
import { nanoid } from 'nanoid'

const inputCls = 'h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:bg-white transition-all'

function FieldRow({ icon, label, children, onRemove }: { icon: React.ReactNode; label: string; children: React.ReactNode; onRemove?: () => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span className="text-gray-400">{icon}</span>
          {label}
        </label>
        {onRemove && (
          <button type="button" onClick={onRemove} className="text-gray-300 hover:text-red-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

function AddBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-1.5 text-sm text-[#0099FF] font-medium hover:text-[#0077CC] transition-colors py-0.5">
      {children}
    </button>
  )
}

// Inline SVG icons for form fields
const IconUser = () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
const IconBadge = () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"/></svg>
const IconBriefcase = () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
const IconBuilding = () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
const IconPin = () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
const IconPhone = () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
const IconMail = () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>

interface ProfileEditorProps {
  profile: Profile
}

type Tab = 'info' | 'links' | 'theme'

export function ProfileEditor({ profile: initialProfile }: ProfileEditorProps) {
  const [profile, setProfile] = useState(initialProfile)
  const [tab, setTab] = useState<Tab>('info')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const { color: extractedColor, extractFromUrl } = useColorExtract()
  const { premium, limits } = useSubscription(profile)

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((p) => ({ ...p, [key]: value }))
  }

  function handleAvatarUpload(url: string) {
    update('avatar_url', url)
    extractFromUrl(url)
  }

  function handleCoverUpload(url: string) {
    update('cover_url', url)
    extractFromUrl(url)
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Erreur lors de la sauvegarde')
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
        startTransition(() => router.refresh())
      }
    } catch {
      setError('Erreur réseau')
    }
    setSaving(false)
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'info', label: 'Infos' },
    { id: 'links', label: 'Liens' },
    { id: 'theme', label: 'Thème' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Ma carte de visite</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {profile.is_published ? (
              <span className="text-green-600 font-medium">● Publiée</span>
            ) : (
              <span className="text-gray-400">● Brouillon</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-gray-600">Publier</span>
            <div
              onClick={async () => {
                const newVal = !profile.is_published
                update('is_published', newVal)
                await fetch('/api/profile', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ is_published: newVal }),
                })
                startTransition(() => router.refresh())
              }}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                profile.is_published ? 'bg-[#0099FF]' : 'bg-gray-200'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                profile.is_published ? 'left-6' : 'left-1'
              }`} />
            </div>
          </label>
          <Button onClick={handleSave} loading={saving} size="sm">
            {saved ? '✓ Sauvegardé' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'info' && (
        <div className="flex flex-col gap-5">
          {/* Cover + Avatar */}
          <div className="flex flex-col items-center gap-4">
            <CoverUpload userId={profile.id} currentUrl={profile.cover_url} onUpload={handleCoverUpload} />
            <div className="-mt-8 z-10">
              <AvatarUpload userId={profile.id} currentUrl={profile.avatar_url} onUpload={handleAvatarUpload} />
            </div>
          </div>

          {/* Identité */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Identité</p>
            <FieldRow icon={<IconUser />} label="Nom d'utilisateur (URL)">
              <input
                type="text"
                value={profile.username}
                onChange={(e) => update('username', e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="jean_dupont"
                className={inputCls}
              />
            </FieldRow>
            <FieldRow icon={<IconBadge />} label="Nom complet">
              <input type="text" value={profile.full_name || ''} onChange={(e) => update('full_name', e.target.value)} placeholder="Jean Dupont" className={inputCls} />
            </FieldRow>
            <FieldRow icon={<IconBriefcase />} label="Poste / Titre">
              <input type="text" value={profile.job_title || ''} onChange={(e) => update('job_title', e.target.value)} placeholder="Directeur Commercial" className={inputCls} />
            </FieldRow>
            <FieldRow icon={<IconBuilding />} label="Entreprise">
              <input type="text" value={profile.company || ''} onChange={(e) => update('company', e.target.value)} placeholder="Soukep SAS" className={inputCls} />
            </FieldRow>
            <FieldRow icon={<IconPin />} label="Localisation">
              <input type="text" value={profile.location || ''} onChange={(e) => update('location', e.target.value)} placeholder="Paris, France" className={inputCls} />
            </FieldRow>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1.5">Bio courte</p>
              <textarea
                rows={3}
                value={profile.bio || ''}
                onChange={(e) => update('bio', e.target.value)}
                placeholder="Quelques mots sur vous..."
                className={`${inputCls} resize-none py-2.5`}
              />
            </div>
          </div>

          {/* Coordonnées */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Coordonnées</p>

            {/* Téléphones */}
            {profile.phone_numbers.map((phone, i) => (
              <FieldRow key={phone.id} icon={<IconPhone />} label={`Téléphone ${i + 1}`} onRemove={() => update('phone_numbers', profile.phone_numbers.filter((_, j) => j !== i))}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={phone.label}
                    onChange={(e) => { const u = [...profile.phone_numbers]; u[i] = { ...phone, label: e.target.value }; update('phone_numbers', u) }}
                    placeholder="Label"
                    className={`${inputCls} w-28`}
                  />
                  <input
                    type="tel"
                    value={phone.number}
                    onChange={(e) => { const u = [...profile.phone_numbers]; u[i] = { ...phone, number: e.target.value }; update('phone_numbers', u) }}
                    placeholder="+33 6 00 00 00 00"
                    className={`${inputCls} flex-1`}
                  />
                </div>
              </FieldRow>
            ))}
            <AddBtn onClick={() => update('phone_numbers', [...profile.phone_numbers, { id: nanoid(), label: 'Professionnel', number: '', order: profile.phone_numbers.length }])}>
              + Ajouter un téléphone
            </AddBtn>

            {/* Emails */}
            {(profile.emails || []).map((em, i) => (
              <FieldRow key={em.id} icon={<IconMail />} label={`Email ${i + 1}`} onRemove={() => update('emails', (profile.emails || []).filter((_, j) => j !== i))}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={em.label}
                    onChange={(e) => { const u = [...(profile.emails || [])]; u[i] = { ...em, label: e.target.value }; update('emails', u) }}
                    placeholder="Label"
                    className={`${inputCls} w-28`}
                  />
                  <input
                    type="email"
                    value={em.email}
                    onChange={(e) => { const u = [...(profile.emails || [])]; u[i] = { ...em, email: e.target.value }; update('emails', u) }}
                    placeholder="contact@exemple.com"
                    className={`${inputCls} flex-1`}
                  />
                </div>
              </FieldRow>
            ))}
            <AddBtn onClick={() => update('emails', [...(profile.emails || []), { id: nanoid(), label: 'Professionnel', email: '', order: (profile.emails || []).length }])}>
              + Ajouter un email
            </AddBtn>
          </div>
        </div>
      )}

      {tab === 'links' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {profile.social_links.length} / {limits.maxLinks === Infinity ? '∞' : limits.maxLinks} liens
            </p>
            {!premium && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg font-medium">
                Free — 5 liens max
              </span>
            )}
          </div>
          <SocialLinksEditor
            links={profile.social_links}
            onChange={(links) => update('social_links', links)}
            maxLinks={limits.maxLinks}
          />
        </div>
      )}

      {tab === 'theme' && (
        <ThemeEditor
          accentColor={profile.accent_color || '#0099FF'}
          onChange={(color) => update('accent_color', color)}
          isPremium={premium}
          extractedColor={extractedColor}
        />
      )}
    </div>
  )
}
