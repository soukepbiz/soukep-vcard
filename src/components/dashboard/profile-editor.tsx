'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { AvatarUpload } from './avatar-upload'
import { CoverUpload } from './cover-upload'
import { SocialLinksEditor } from './social-links-editor'
import { ThemeEditor } from './theme-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useColorExtract } from '@/hooks/use-color-extract'
import { useSubscription } from '@/hooks/use-subscription'
import type { Profile, SocialLink } from '@/types/profile'
import { nanoid } from 'nanoid'

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
          <div className="flex flex-col items-center gap-4">
            <CoverUpload
              userId={profile.id}
              currentUrl={profile.cover_url}
              onUpload={handleCoverUpload}
            />
            <div className="-mt-8 z-10">
              <AvatarUpload
                userId={profile.id}
                currentUrl={profile.avatar_url}
                onUpload={handleAvatarUpload}
              />
            </div>
          </div>

          <Input
            id="username"
            label="Nom d'utilisateur (URL)"
            value={profile.username}
            onChange={(e) => update('username', e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
            placeholder="jean_dupont"
          />
          <Input
            id="full_name"
            label="Nom complet"
            value={profile.full_name || ''}
            onChange={(e) => update('full_name', e.target.value)}
            placeholder="Jean Dupont"
          />
          <Input
            id="job_title"
            label="Titre / Poste"
            value={profile.job_title || ''}
            onChange={(e) => update('job_title', e.target.value)}
            placeholder="Designer UX"
          />
          <Input
            id="company"
            label="Entreprise"
            value={profile.company || ''}
            onChange={(e) => update('company', e.target.value)}
            placeholder="Acme Corp"
          />
          <Textarea
            id="bio"
            label="Bio courte"
            value={profile.bio || ''}
            onChange={(e) => update('bio', e.target.value)}
            placeholder="Quelques mots sur vous..."
            rows={3}
          />
          <Input
            id="location"
            label="Localisation"
            value={profile.location || ''}
            onChange={(e) => update('location', e.target.value)}
            placeholder="Paris, France"
          />

          {/* Phone numbers */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Téléphones</p>
            <div className="flex flex-col gap-2">
              {profile.phone_numbers.map((phone, i) => (
                <div key={phone.id} className="flex gap-2">
                  <input
                    type="text"
                    value={phone.label}
                    onChange={(e) => {
                      const updated = [...profile.phone_numbers]
                      updated[i] = { ...phone, label: e.target.value }
                      update('phone_numbers', updated)
                    }}
                    placeholder="Travail"
                    className="h-10 w-24 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0099FF]"
                  />
                  <input
                    type="tel"
                    value={phone.number}
                    onChange={(e) => {
                      const updated = [...profile.phone_numbers]
                      updated[i] = { ...phone, number: e.target.value }
                      update('phone_numbers', updated)
                    }}
                    placeholder="+33 6 00 00 00 00"
                    className="h-10 flex-1 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0099FF]"
                  />
                  <button
                    type="button"
                    onClick={() => update('phone_numbers', profile.phone_numbers.filter((_, j) => j !== i))}
                    className="p-2 text-gray-300 hover:text-red-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => update('phone_numbers', [...profile.phone_numbers, { id: nanoid(), label: 'Professionnel', number: '', order: profile.phone_numbers.length }])}
                className="flex items-center gap-2 h-9 text-sm text-[#0099FF] hover:underline"
              >
                + Ajouter un téléphone
              </button>
            </div>
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
          accentColor={profile.accent_color || '#6366F1'}
          onChange={(color) => update('accent_color', color)}
          isPremium={premium}
          extractedColor={extractedColor}
        />
      )}
    </div>
  )
}
