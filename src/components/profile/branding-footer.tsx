import Link from 'next/link'

export function BrandingFooter() {
  return (
    <Link
      href="/"
      className="flex items-center justify-center gap-1.5 py-2 opacity-60 hover:opacity-90 transition-opacity"
    >
      <div className="w-3.5 h-3.5 rounded bg-[#0099FF] flex items-center justify-center flex-shrink-0">
        <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <span className="text-[11px] font-medium text-gray-500">Soukep vCard</span>
    </Link>
  )
}
