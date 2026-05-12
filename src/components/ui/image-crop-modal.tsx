'use client'

import { useState, useCallback } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import { X, Check, ZoomIn, ZoomOut, Grid3X3 } from 'lucide-react'

interface ImageCropModalProps {
  imageSrc: string
  aspect: number
  onConfirm: (croppedBlob: Blob) => void
  onCancel: () => void
  shape?: 'round' | 'rect'
}

async function getCroppedBlob(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image()
    i.crossOrigin = 'anonymous'
    i.onload = () => res(i)
    i.onerror = rej
    // Add cache-busting to bypass CORS cache on Supabase CDN
    i.src = imageSrc.includes('?') ? imageSrc + '&cb=' + Date.now() : imageSrc + '?cb=' + Date.now()
  })
  const canvas = document.createElement('canvas')
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height)
  return new Promise((res, rej) => canvas.toBlob((b) => b ? res(b) : rej(new Error('canvas empty')), 'image/jpeg', 0.92))
}

const ZOOM_STEP = 0.1
const ZOOM_MIN = 1
const ZOOM_MAX = 3

export function ImageCropModal({ imageSrc, aspect, onConfirm, onCancel, shape = 'rect' }: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [showGrid, setShowGrid] = useState(true)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [saving, setSaving] = useState(false)

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  async function handleConfirm() {
    if (!croppedAreaPixels) return
    setSaving(true)
    try {
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels)
      onConfirm(blob)
    } finally {
      setSaving(false)
    }
  }

  function zoomIn() { setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2))) }
  function zoomOut() { setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2))) }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="font-bold text-gray-900 text-base">Cadrer l&apos;image</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowGrid((g) => !g)}
              title={showGrid ? 'Masquer la grille' : 'Afficher la grille'}
              className={`p-1.5 rounded-lg transition-colors ${showGrid ? 'bg-[#E6F4FF] text-[#0099FF]' : 'text-gray-400 hover:text-gray-700'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={onCancel} className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Crop area */}
        <div className="relative bg-gray-900" style={{ height: 300 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={shape}
            showGrid={showGrid}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: { borderRadius: 0 },
              cropAreaStyle: { border: '2px solid #0099FF', color: 'rgba(0,153,255,0.15)' },
            }}
          />
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-3 px-5 py-3">
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= ZOOM_MIN}
            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <input
            type="range" min={ZOOM_MIN} max={ZOOM_MAX} step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-[#0099FF]"
          />
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= ZOOM_MAX}
            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-5 pb-6">
          <button onClick={onCancel}
            className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Annuler
          </button>
          <button onClick={handleConfirm} disabled={saving}
            className="flex-1 h-11 rounded-xl bg-[#0099FF] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#0077CC] disabled:opacity-60 transition-colors">
            {saving ? (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <><Check className="w-4 h-4" /> Valider</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
