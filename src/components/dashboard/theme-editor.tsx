'use client'

import { HexColorPicker } from 'react-colorful'
import { useState } from 'react'
import { DEFAULT_ACCENT_COLOR } from '@/lib/constants'

interface ThemeEditorProps {
  accentColor: string
  onChange: (color: string) => void
  isPremium: boolean
  extractedColor?: string | null
}

export function ThemeEditor({ accentColor, onChange, isPremium, extractedColor }: ThemeEditorProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Couleur d&apos;accentuation</p>

        {extractedColor && (
          <div className="flex items-center gap-2 mb-3 p-3 bg-gray-50 rounded-xl">
            <div
              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: extractedColor }}
            />
            <span className="text-xs text-gray-600">Couleur extraite de votre image</span>
            <button
              type="button"
              onClick={() => onChange(extractedColor)}
              className="ml-auto text-xs text-[#0099FF] font-medium hover:underline"
            >
              Utiliser
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl border-2 border-white shadow-md cursor-pointer"
            style={{ backgroundColor: accentColor }}
            onClick={() => isPremium && setOpen(!open)}
          />
          <div>
            <p className="text-sm font-medium text-gray-800">{accentColor}</p>
            {!isPremium && (
              <p className="text-xs text-gray-400">Premium requis pour personnaliser</p>
            )}
          </div>
          {isPremium && (
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="ml-auto text-xs text-[#0099FF] font-medium hover:underline"
            >
              {open ? 'Fermer' : 'Changer'}
            </button>
          )}
        </div>

        {open && isPremium && (
          <div className="mt-4">
            <HexColorPicker color={accentColor} onChange={onChange} className="w-full!" />
            <button
              type="button"
              onClick={() => onChange(DEFAULT_ACCENT_COLOR)}
              className="mt-2 text-xs text-gray-400 hover:text-gray-600"
            >
              Réinitialiser
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
