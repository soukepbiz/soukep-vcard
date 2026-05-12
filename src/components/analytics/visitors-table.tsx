'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { getCountryName } from '@/lib/analytics/parser'

interface Visitor {
  id: number
  viewedAt: string
  ip: string | null
  country: string | null
  city: string | null
  deviceType: string | null
  browser: string | null
  os: string | null
  referrer: string | null
}

interface VisitorsTableProps {
  visitors: Visitor[]
}

export function VisitorsTable({ visitors }: VisitorsTableProps) {
  const [showIPs, setShowIPs] = useState(false)
  const [page, setPage] = useState(1)
  const perPage = 10
  const totalPages = Math.ceil(visitors.length / perPage)
  const start = (page - 1) * perPage
  const end = start + perPage
  const pageData = visitors.slice(start, end)

  const maskIP = (ip: string | null) => {
    if (!ip) return '—'
    if (!showIPs) return ip.split('.').slice(0, 3).join('.') + '.***'
    return ip
  }

  const getDomainFromReferrer = (referrer: string | null) => {
    if (!referrer) return 'Direct'
    try {
      const url = new URL(referrer)
      return url.hostname.replace('www.', '')
    } catch {
      return referrer
    }
  }

  if (visitors.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-5 h-80 flex items-center justify-center">
        <p className="text-gray-400">Aucun visiteur pour le moment</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Visiteurs récents</h3>
        <button
          onClick={() => setShowIPs(!showIPs)}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {showIPs ? (
            <>
              <EyeOff size={14} />
              Masquer IPs
            </>
          ) : (
            <>
              <Eye size={14} />
              Afficher IPs
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-3 font-semibold text-gray-600">Heure</th>
              <th className="text-left py-3 px-3 font-semibold text-gray-600">IP</th>
              <th className="text-left py-3 px-3 font-semibold text-gray-600">Pays</th>
              <th className="text-left py-3 px-3 font-semibold text-gray-600">Appareil</th>
              <th className="text-left py-3 px-3 font-semibold text-gray-600">Navigateur</th>
              <th className="text-left py-3 px-3 font-semibold text-gray-600">OS</th>
              <th className="text-left py-3 px-3 font-semibold text-gray-600">Referrer</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((visitor) => (
              <tr key={visitor.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-3 text-gray-700 text-xs">
                  {new Date(visitor.viewedAt).toLocaleTimeString('fr-FR')}
                </td>
                <td className="py-3 px-3 text-gray-600 text-xs font-mono">
                  {maskIP(visitor.ip)}
                </td>
                <td className="py-3 px-3 text-gray-700">
                  {getCountryName(visitor.country)}
                </td>
                <td className="py-3 px-3 text-gray-700 text-xs capitalize">
                  {visitor.deviceType || '—'}
                </td>
                <td className="py-3 px-3 text-gray-700 text-xs">
                  {visitor.browser || '—'}
                </td>
                <td className="py-3 px-3 text-gray-700 text-xs">
                  {visitor.os || '—'}
                </td>
                <td className="py-3 px-3 text-gray-600 text-xs">
                  <span className="truncate max-w-xs">{getDomainFromReferrer(visitor.referrer)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
          >
            ←
          </button>
          <span className="text-xs text-gray-600">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
