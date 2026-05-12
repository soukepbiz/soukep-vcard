'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { ImageCropModal } from '@/components/ui/image-crop-modal'
import { Camera, Pencil } from 'lucide-react'

interface AvatarUploadProps {
  userId: string
  currentUrl: string | null
  onUpload: (url: string) => void
}

export function AvatarUpload({ userId, currentUrl, onUpload }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [rawSrc, setRawSrc] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setRawSrc(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  async function handleCropConfirm(blob: Blob) {
    setRawSrc(null)
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
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 hover:border-[#33ADFF] transition-colors group"
          >
            {currentUrl ? (
              <Image src={currentUrl} alt="Avatar" fill className="object-cover" sizes="96px" />
            ) : (
              <Camera className="w-8 h-8 text-gray-400 absolute inset-0 m-auto" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
              <Camera className="w-6 h-6 text-white" />
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                <svg className="animate-spin w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              </div>
            )}
          </button>
          {currentUrl && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0099FF] text-white flex items-center justify-center shadow-md hover:bg-[#0077CC] transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400">Photo de profil</p>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      {rawSrc && (
        <ImageCropModal
          imageSrc={rawSrc}
          aspect={1}
          shape="round"
          onConfirm={handleCropConfirm}
          onCancel={() => setRawSrc(null)}
        />
      )}
    </>
  )
}
