'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import type { SocialLink } from '@/types/profile'
import { nanoid } from 'nanoid'
import { BRAND_PATHS } from '@/lib/brand-icons'
import { Globe, Link as LinkIcon, Pencil, Check, X } from 'lucide-react'

const PLATFORMS = [
  { id: 'whatsapp',   label: 'WhatsApp',   color: '#25D366', placeholder: 'https://wa.me/33600000000' },
  { id: 'linkedin',   label: 'LinkedIn',   color: '#0A66C2', placeholder: 'https://linkedin.com/in/votre-profil' },
  { id: 'instagram',  label: 'Instagram',  color: '#E1306C', placeholder: 'https://instagram.com/votre-compte' },
  { id: 'facebook',   label: 'Facebook',   color: '#1877F2', placeholder: 'https://facebook.com/votre-page' },
  { id: 'tiktok',     label: 'TikTok',     color: '#010101', placeholder: 'https://tiktok.com/@votre-compte' },
  { id: 'twitter',    label: 'X (Twitter)',color: '#000000', placeholder: 'https://x.com/votre-compte' },
  { id: 'telegram',   label: 'Telegram',   color: '#26A5E4', placeholder: 'https://t.me/votre-compte' },
  { id: 'snapchat',   label: 'Snapchat',   color: '#FFC300', placeholder: 'https://snapchat.com/add/votre-compte' },
  { id: 'youtube',    label: 'YouTube',    color: '#FF0000', placeholder: 'https://youtube.com/@votre-chaine' },
  { id: 'github',     label: 'GitHub',     color: '#181717', placeholder: 'https://github.com/votre-profil' },
  { id: 'pinterest',  label: 'Pinterest',  color: '#BD081C', placeholder: 'https://pinterest.com/votre-compte' },
  { id: 'discord',    label: 'Discord',    color: '#5865F2', placeholder: 'https://discord.gg/votre-serveur' },
  { id: 'twitch',     label: 'Twitch',     color: '#9146FF', placeholder: 'https://twitch.tv/votre-chaine' },
  { id: 'spotify',    label: 'Spotify',    color: '#1DB954', placeholder: 'https://open.spotify.com/artist/...' },
  { id: 'website',    label: 'Site Web',   color: '#0099FF', placeholder: 'https://votre-site.com' },
  { id: 'custom',     label: 'Lien perso', color: '#6B7280', placeholder: 'https://...' },
]


function PlatformIcon({ id, color }: { id: string; color: string }) {
  if (id === 'website') return <Globe className="w-5 h-5" style={{ color }} strokeWidth={1.8} />
  if (id === 'custom') return <LinkIcon className="w-5 h-5" style={{ color }} strokeWidth={1.8} />
  const path = BRAND_PATHS[id]
  if (path) {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ fill: color }}>
        <path d={path} />
      </svg>
    )
  }
  return <Globe className="w-5 h-5" style={{ color }} strokeWidth={1.8} />
}

interface SocialLinksEditorProps {
  links: SocialLink[]
  onChange: (links: SocialLink[]) => void
  maxLinks: number
}

export function SocialLinksEditor({ links, onChange, maxLinks }: SocialLinksEditorProps) {
  const [addingPlatform, setAddingPlatform] = useState<string | null>(null)
  const [newUrl, setNewUrl] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editUrl, setEditUrl] = useState('')

  function startEdit(link: SocialLink) {
    setEditingId(link.id)
    setEditTitle(link.title)
    setEditUrl(link.url)
  }

  function confirmEdit() {
    if (!editingId || !editUrl) return
    onChange(links.map((l) => l.id === editingId ? { ...l, title: editTitle, url: editUrl } : l))
    setEditingId(null)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return
    const reordered = Array.from(links)
    const [removed] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, removed)
    onChange(reordered.map((l, i) => ({ ...l, order: i })))
  }

  function startAdding(platformId: string) {
    const p = PLATFORMS.find((p) => p.id === platformId)!
    setAddingPlatform(platformId)
    setNewTitle(p.label)
    setNewUrl('')
  }

  function confirmAdd() {
    if (!addingPlatform || !newUrl) return
    onChange([...links, { id: nanoid(), platform: addingPlatform, title: newTitle, url: newUrl, order: links.length }])
    setAddingPlatform(null)
    setNewUrl('')
    setNewTitle('')
  }

  function removeLink(id: string) {
    onChange(links.filter((l) => l.id !== id).map((l, i) => ({ ...l, order: i })))
  }

  const atLimit = links.length >= maxLinks
  const addedPlatforms = new Set(links.map((l) => l.platform))

  return (
    <div className="flex flex-col gap-4">
      {/* Platform quick-add grid */}
      {!atLimit && !addingPlatform && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Ajouter un réseau</p>
          <div className="grid grid-cols-4 gap-2">
            {PLATFORMS.map((p) => {
              const added = addedPlatforms.has(p.id) && p.id !== 'custom'
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => !added && startAdding(p.id)}
                  disabled={added}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                    added ? 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed' : 'border-gray-200 bg-white hover:border-[#B3DBFF] hover:bg-[#F0F8FF] active:scale-95'
                  }`}
                >
                  <PlatformIcon id={p.id} color={added ? '#9CA3AF' : p.color} />
                  <span className="text-xs text-gray-500 font-medium leading-tight text-center">{p.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Add form */}
      {addingPlatform && (() => {
        const p = PLATFORMS.find((pl) => pl.id === addingPlatform)!
        return (
          <div className="bg-[#F0F8FF] border border-[#B3DBFF] rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <PlatformIcon id={p.id} color={p.color} />
              <p className="text-sm font-bold text-gray-800">{p.label}</p>
            </div>
            <input
              type="text"
              placeholder="Titre affiché"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#B3DBFF] bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0099FF]"
            />
            <input
              type="url"
              placeholder={p.placeholder}
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#B3DBFF] bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0099FF]"
            />
            <div className="flex gap-2">
              <button type="button" onClick={confirmAdd} disabled={!newUrl}
                className="flex-1 h-9 bg-[#0099FF] disabled:opacity-50 text-white text-sm font-semibold rounded-xl hover:bg-[#0077CC] transition-colors">
                Ajouter
              </button>
              <button type="button" onClick={() => setAddingPlatform(null)}
                className="flex-1 h-9 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                Annuler
              </button>
            </div>
          </div>
        )
      })()}

      {/* Links list with drag */}
      {links.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="social-links">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-2">
                {links.map((link, index) => {
                  const p = PLATFORMS.find((pl) => pl.id === link.platform)
                  return (
                    <Draggable key={link.id} draggableId={link.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex flex-col gap-2 bg-white border rounded-xl px-3 py-2.5 transition-shadow ${
                            snapshot.isDragging ? 'shadow-lg border-[#B3DBFF]' : editingId === link.id ? 'border-[#0099FF]' : 'border-gray-200'
                          }`}
                        >
                          {editingId === link.id ? (
                            /* Mode édition inline */
                            <>
                              <div className="flex items-center gap-2">
                                <PlatformIcon id={link.platform} color={p?.color || '#6B7280'} />
                                <span className="text-xs font-semibold text-[#0099FF]">{p?.label || link.platform}</span>
                              </div>
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="Titre affiché"
                                className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0099FF]"
                              />
                              <input
                                type="url"
                                value={editUrl}
                                onChange={(e) => setEditUrl(e.target.value)}
                                placeholder={p?.placeholder || 'https://...'}
                                className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0099FF]"
                              />
                              <div className="flex gap-2">
                                <button type="button" onClick={confirmEdit} disabled={!editUrl}
                                  className="flex-1 h-8 bg-[#0099FF] disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 hover:bg-[#0077CC] transition-colors">
                                  <Check size={13} /> Valider
                                </button>
                                <button type="button" onClick={cancelEdit}
                                  className="flex-1 h-8 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-lg flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors">
                                  <X size={13} /> Annuler
                                </button>
                              </div>
                            </>
                          ) : (
                            /* Mode affichage */
                            <div className="flex items-center gap-3">
                              <div {...provided.dragHandleProps} className="text-gray-300 cursor-grab">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 6a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm8-16a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4z"/></svg>
                              </div>
                              <PlatformIcon id={link.platform} color={p?.color || '#6B7280'} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{link.title}</p>
                                <p className="text-xs text-gray-400 truncate">{link.url}</p>
                              </div>
                              <button type="button" onClick={() => startEdit(link)} className="p-1 text-gray-300 hover:text-[#0099FF] transition-colors">
                                <Pencil size={14} />
                              </button>
                              <button type="button" onClick={() => removeLink(link.id)} className="p-1 text-gray-300 hover:text-red-500 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {atLimit && (
        <p className="text-center text-xs text-amber-600 bg-amber-50 rounded-xl py-2 px-3">
          Limite de {maxLinks} liens atteinte — passez en Premium pour en ajouter plus.
        </p>
      )}
    </div>
  )
}
