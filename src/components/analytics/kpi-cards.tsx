function formatLastView(dateStr: string | null): string {
  if (!dateStr) return 'Jamais'
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'À l\'instant'
  if (diffMins < 60) return `Il y a ${diffMins}m`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays < 30) return `Il y a ${diffDays}j`
  return date.toLocaleDateString('fr-FR')
}

interface KPICardsProps {
  totalViews: number
  uniqueVisitors: number
  countries: number
  lastView: string | null
}

export function KPICards({ totalViews, uniqueVisitors, countries, lastView }: KPICardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-3xl font-bold text-[#0099FF]">{totalViews}</p>
        <p className="text-xs text-gray-500 mt-2 font-medium">Total vues</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-3xl font-bold text-[#33ADFF]">{uniqueVisitors}</p>
        <p className="text-xs text-gray-500 mt-2 font-medium">Visiteurs uniques</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-3xl font-bold text-[#0077CC]">{countries}</p>
        <p className="text-xs text-gray-500 mt-2 font-medium">Pays atteints</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-sm font-semibold text-gray-700">{formatLastView(lastView)}</p>
        <p className="text-xs text-gray-500 mt-2 font-medium">Dernière visite</p>
      </div>
    </div>
  )
}
