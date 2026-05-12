'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { ImageCropModal } from '@/components/ui/image-crop-modal'
import { Camera, Pencil, RefreshCw } from 'lucide-react'

interface AvatarUploadProps {
  userId: string
  currentUrl: string | null
  onUpload: (url: string) => void
}

export function AvatarUpload({ userId, currentUrl, onUpload }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCropSrc(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function handleRecrop() {
    if (currentUrl) setCropSrc(currentUrl)
  }

  async function handleCropConfirm(blob: Blob) {
    setCropSrc(null)
    setUploading(true)
    const path = `${userId}/${Date.now()}.jpg`
    const { error } = await supabase.storage.from('avatars').upload(path, blob, { upsert: true, contentType: 'image/jpeg' })
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      onUpload(data.publicUrl)
    }
    setUploading(false)
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          {/* Avatar circle */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
            {currentUrl ? (
              <Image src={currentUrl} alt="Avatar" fill className="object-cover" sizes="96px" />
            ) : (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="absolute inset-0 flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
              >
                <Camera className="w-7 h-7 text-gray-400" />
                <span className="text-[10px] text-gray-400 font-medium">Ajouter</span>
              </button>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                <svg className="animate-spin w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              </div>
            )}
          </div>

          {/* Action buttons when image exists */}
          {currentUrl && !uploading && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1 whitespace-nowrap">
              <button
                type="button"
                onClick={handleRecrop}
                title="Recadrer"
                className="w-7 h-7 rounded-full bg-[#0099FF] text-white flex items-center justify-center shadow-md hover:bg-[#0077CC] transition-colors"
              >
                <Pencil className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                title="Changer la photo"
                className="w-7 h-7 rounded-full bg-gray-700 text-white flex items-center justify-center shadow-md hover:bg-gray-900 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-1">Photo de profil</p>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          aspect={1}
          shape="round"
          onConfirm={handleCropConfirm}
          onCancel={() => setCropSrc(null)}
        />
      )}
    </>
  )
}
