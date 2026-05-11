'use client'

import { useState, useCallback } from 'react'

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
}

export function useColorExtract() {
  const [color, setColor] = useState<string | null>(null)

  const extractFromUrl = useCallback((imageUrl: string) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      try {
        // Dynamically import colorthief to avoid SSR issues
        import('colorthief').then((mod) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const CT = (mod as any).default ?? mod
          const ct = new CT()
          const [r, g, b] = ct.getColor(img)
          setColor(rgbToHex(r, g, b))
        })
      } catch {
        // colorthief failed, keep existing color
      }
    }
    img.src = imageUrl
  }, [])

  return { color, extractFromUrl }
}
