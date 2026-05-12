'use client'

import { useState } from 'react'

interface AddContactFabProps {
  username: string
  accentColor: string
  contrastColor?: string
}

export function AddContactFab({ username, accentColor, contrastColor = '#FFFFFF' }: AddContactFabProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAddContact = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/${username}/vcard`)
      const vcardContent = await response.text()

      const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${username}.vcf`)

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erreur lors de l\'ajout du contact:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xs px-4 pointer-events-none">
      <button
        onClick={handleAddContact}
        disabled={isLoading}
        className="flex items-center justify-center gap-2.5 w-full h-12 rounded-xl font-semibold text-sm tracking-wide active:scale-[0.98] transition-all duration-200 pointer-events-auto disabled:opacity-70"
        style={{
          backgroundColor: accentColor,
          color: contrastColor,
          boxShadow: `0 4px 24px ${accentColor}70, 0 1px 4px ${accentColor}40`,
        }}
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        {isLoading ? 'Ajout...' : 'Ajouter aux contacts'}
      </button>
    </div>
  )
}
