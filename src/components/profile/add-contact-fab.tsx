'use client'

interface AddContactFabProps {
  username: string
  accentColor: string
  contrastColor?: string
}

export function AddContactFab({ username, accentColor, contrastColor = '#FFFFFF' }: AddContactFabProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xs px-4 pointer-events-none">
      <a
        href={`/${username}/vcard`}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2.5 w-full h-12 rounded-xl font-semibold text-sm tracking-wide active:scale-[0.98] transition-all duration-200 pointer-events-auto"
        style={{
          backgroundColor: accentColor,
          color: contrastColor,
          boxShadow: `0 4px 24px ${accentColor}70, 0 1px 4px ${accentColor}40`,
        }}
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        Ajouter aux contacts
      </a>
    </div>
  )
}
