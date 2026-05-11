'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface CoverUploadProps {
  userId: string
  currentUrl: string | null
  onUpload: (url: string) => void
}

export function CoverUpload({ userId, currentUrl, onUpload }: CoverUploadProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function handleFile(file: File) {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${userId}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('covers').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('covers').getPublicUrl(path)
      onUpload(data.publicUrl)
    }
    setUploading(false)
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="relative group w-full h-32 rounded-2xl overflow-hidden bg-gradient-to-r from-[#E6F4FF] to-[#B3DBFF] border-2 border-dashed border-gray-200 hover:border-[#33ADFF] transition-colors"
    >
      {currentUrl ? (
        <Image src={currentUrl} alt="Bannière" fill className="object-cover" sizes="100vw" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs text-gray-400">Image de couverture</span>
        </div>
      )}
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <span className="text-white text-sm font-medium">Changer la bannière</span>
      </div>
      {uploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <svg className="animate-spin w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </button>
  )
}
