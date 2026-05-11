'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import { SOCIAL_PLATFORMS } from '@/lib/constants'
import type { SocialLink } from '@/types/profile'
import { nanoid } from 'nanoid'

interface SocialLinksEditorProps {
  links: SocialLink[]
  onChange: (links: SocialLink[]) => void
  maxLinks: number
}

export function SocialLinksEditor({ links, onChange, maxLinks }: SocialLinksEditorProps) {
  const [adding, setAdding] = useState(false)
  const [newPlatform, setNewPlatform] = useState('custom')
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return
    const reordered = Array.from(links)
    const [removed] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, removed)
    onChange(reordered.map((l, i) => ({ ...l, order: i })))
  }

  function addLink() {
    if (!newTitle || !newUrl) return
    const platform = SOCIAL_PLATFORMS.find((p) => p.id === newPlatform)
    onChange([
      ...links,
      { id: nanoid(), platform: newPlatform, title: newTitle || platform?.label || 'Lien', url: newUrl, order: links.length },
    ])
    setAdding(false)
    setNewTitle('')
    setNewUrl('')
    setNewPlatform('custom')
  }

  function removeLink(id: string) {
    onChange(links.filter((l) => l.id !== id).map((l, i) => ({ ...l, order: i })))
  }

  const atLimit = links.length >= maxLinks

  return (
    <div className="flex flex-col gap-3">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="social-links">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-2">
              {links.map((link, index) => (
                <Draggable key={link.id} draggableId={link.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center gap-3 bg-white border rounded-xl px-3 py-2.5 transition-shadow ${
                        snapshot.isDragging ? 'shadow-lg border-[#B3DBFF]' : 'border-gray-200'
                      }`}
                    >
                      <div {...provided.dragHandleProps} className="text-gray-300 cursor-grab">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 6a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm8-16a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{link.title}</p>
                        <p className="text-xs text-gray-400 truncate">{link.url}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLink(link.id)}
                        className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {adding ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
          <select
            value={newPlatform}
            onChange={(e) => {
              setNewPlatform(e.target.value)
              const p = SOCIAL_PLATFORMS.find((p) => p.id === e.target.value)
              if (p && p.id !== 'custom') setNewTitle(p.label)
            }}
            className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0099FF]"
          >
            {SOCIAL_PLATFORMS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Titre du lien"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0099FF]"
          />
          <input
            type="url"
            placeholder="https://..."
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0099FF]"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addLink}
              className="flex-1 h-9 bg-[#0099FF] text-white text-sm font-medium rounded-xl hover:bg-[#0077CC] transition-colors"
            >
              Ajouter
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="flex-1 h-9 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          disabled={atLimit}
          className="flex items-center justify-center gap-2 h-10 w-full border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-[#33ADFF] hover:text-[#0099FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {atLimit ? `Limite atteinte (${maxLinks} liens max)` : 'Ajouter un lien'}
        </button>
      )}
    </div>
  )
}
