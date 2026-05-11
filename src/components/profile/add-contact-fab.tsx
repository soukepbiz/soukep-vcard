'use client'

interface AddContactFabProps {
  username: string
  accentColor: string
}

export function AddContactFab({ username, accentColor }: AddContactFabProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
      <a
        href={`/${username}/vcard`}
        download
        className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl text-white font-semibold text-base shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200"
        style={{ backgroundColor: accentColor, boxShadow: `0 8px 32px ${accentColor}60` }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Ajouter aux contacts
      </a>
    </div>
  )
}
