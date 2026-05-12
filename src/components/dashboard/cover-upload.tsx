'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { ImageCropModal } from '@/components/ui/image-crop-modal'
import { ImageIcon, Pencil, RefreshCw } from 'lucide-react'

interface CoverUploadProps {
  userId: string
  currentUrl: string | null
  onUpload: (url: string) => void
}

export function CoverUpload({ userId, currentUrl, onUpload }: CoverUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // New file selected → read as data URL → open crop modal
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCropSrc(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // "Recadrer" clicked on existing image → open crop modal with current URL directly
  function handleRecrop() {
    if (currentUrl) setCropSrc(currentUrl)
  }

  async function handleCropConfirm(blob: Blob) {
    setCropSrc(null)
    setUploading(true)
    const path = `${userId}/${Date.now()}.jpg`
    const { error } = await supabase.storage.from('covers').upload(path, blob, { upsert: true, contentType: 'image/jpeg' })
    if (!error) {
      const { data } = supabase.storage.from('covers').getPublicUrl(path)
      onUpload(data.publicUrl)
    }
    setUploading(false)
  }

  return (
    <>
      <div className="relative w-full">
        {/* Cover preview / upload zone — ratio 10:5.3 matches public card (448px / 200px) */}
        <div
          className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-[#E6F4FF] to-[#B3DBFF] border-2 border-dashed border-gray-200 hover:border-[#33ADFF] transition-colors cursor-pointer group"
          style={{ aspectRatio: '448 / 200' }}
          onClick={() => inputRef.current?.click()}
        >
          {currentUrl ? (
            <Image src={currentUrl} alt="Bannière" fill className="object-cover" sizes="100vw" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <ImageIcon className="w-8 h-8 text-gray-400" />
              <span className="text-xs text-gray-400 font-medium">Image de couverture</span>
              <span className="text-xs text-gray-300">Cliquez pour choisir</span>
            </div>
          )}
          {!currentUrl && (
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-semibold">Choisir une image</span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <svg className="animate-spin w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          )}
        </div>

        {/* Action buttons when image exists */}
        {currentUrl && !uploading && (
          <div className="absolute top-2 right-2 flex gap-1.5">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRecrop() }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/55 hover:bg-black/75 text-white text-xs font-semibold rounded-lg backdrop-blur-sm transition-colors"
            >
              <Pencil className="w-3 h-3" />
              Recadrer
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/55 hover:bg-black/75 text-white text-xs font-semibold rounded-lg backdrop-blur-sm transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Changer
            </button>
          </div>
        )}

        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          aspect={3}
          shape="rect"
          onConfirm={handleCropConfirm}
          onCancel={() => setCropSrc(null)}
        />
      )}
    </>
  )
}
