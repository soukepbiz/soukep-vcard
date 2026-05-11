import Link from 'next/link'

export function BrandingFooter() {
  return (
    <div className="flex justify-center py-6">
      <Link
        href="/"
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        <div className="w-4 h-4 rounded bg-[#0099FF] flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        Créé avec Soukep vCard
      </Link>
    </div>
  )
}
