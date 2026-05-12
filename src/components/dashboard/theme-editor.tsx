'use client'

import { HexColorPicker } from 'react-colorful'
import { useState } from 'react'
import { DEFAULT_ACCENT_COLOR } from '@/lib/constants'

interface ThemeEditorProps {
  accentColor: string
  textColor: string
  onChangeAccent: (color: string) => void
  onChangeText: (color: string) => void
  isPremium: boolean
  extractedColor?: string | null
}

function ColorRow({
  label,
  color,
  defaultColor,
  isPremium,
  onChange,
}: {
  label: string
  color: string
  defaultColor: string
  isPremium: boolean
  onChange: (c: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl border-2 border-gray-200 shadow-sm cursor-pointer flex-shrink-0"
          style={{ backgroundColor: color }}
          onClick={() => isPremium && setOpen(!open)}
        />
        <div>
          <p className="text-sm font-medium text-gray-800">{color}</p>
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
          <HexColorPicker color={color} onChange={onChange} className="w-full!" />
          <button
            type="button"
            onClick={() => onChange(defaultColor)}
            className="mt-2 text-xs text-gray-400 hover:text-gray-600"
          >
            Réinitialiser
          </button>
        </div>
      )}
    </div>
  )
}

export function ThemeEditor({ accentColor, textColor, onChangeAccent, onChangeText, isPremium, extractedColor }: ThemeEditorProps) {
  return (
    <div className="flex flex-col gap-6">
      {extractedColor && (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
          <div
            className="w-6 h-6 rounded-full border-2 border-white shadow-sm flex-shrink-0"
            style={{ backgroundColor: extractedColor }}
          />
          <span className="text-xs text-gray-600">Couleur extraite de votre image</span>
          <button
            type="button"
            onClick={() => onChangeAccent(extractedColor)}
            className="ml-auto text-xs text-[#0099FF] font-medium hover:underline flex-shrink-0"
          >
            Utiliser
          </button>
        </div>
      )}

      <ColorRow
        label="Couleur d'accentuation"
        color={accentColor}
        defaultColor={DEFAULT_ACCENT_COLOR}
        isPremium={isPremium}
        onChange={onChangeAccent}
      />

      <ColorRow
        label="Couleur de la police (boutons & badges)"
        color={textColor}
        defaultColor="#FFFFFF"
        isPremium={isPremium}
        onChange={onChangeText}
      />

      <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
        <div className="w-20 h-8 rounded-lg flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: accentColor, color: textColor }}>
          Aperçu
        </div>
        <span className="text-xs text-gray-500">Rendu des boutons et badges</span>
      </div>
    </div>
  )
}
