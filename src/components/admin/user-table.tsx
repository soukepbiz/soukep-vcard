'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SubscriptionModal } from './subscription-modal'
import type { Profile } from '@/types/profile'

interface UserTableProps {
  users: Profile[]
}

export function UserTable({ users: initialUsers }: UserTableProps) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [modalUser, setModalUser] = useState<Profile | null>(null)

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      (u.full_name?.toLowerCase() || '').includes(search.toLowerCase())
  )

  function getBadgeStyle(type: string) {
    if (type === 'lifetime') return 'bg-yellow-100 text-yellow-800'
    if (type === 'premium') return 'bg-[#B3DBFF] text-[#0077CC]'
    return 'bg-gray-100 text-gray-600'
  }

  async function handleBan(userId: string) {
    if (!confirm('Suspendre ce compte ?')) return
    await fetch('/api/admin/subscription', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, subscriptionType: 'free', duration: 'lifetime', suspend: true }),
    })
    setUsers((u) => u.map((p) => p.id === userId ? { ...p, is_published: false } : p))
  }

  return (
    <>
      <div className="mb-4">
        <input
          type="search"
          placeholder="Rechercher par username ou nom..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full max-w-sm rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0099FF]"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="px-4 py-3 font-medium text-gray-600">Utilisateur</th>
              <th className="px-4 py-3 font-medium text-gray-600">Abonnement</th>
              <th className="px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Expiration</th>
              <th className="px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Publié</th>
              <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{user.full_name || '—'}</p>
                  <p className="text-gray-400 text-xs">@{user.username}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeStyle(user.subscription_type)}`}>
                    {user.subscription_type}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
                  {user.subscription_expires_at
                    ? new Date(user.subscription_expires_at).toLocaleDateString('fr-FR')
                    : user.subscription_type === 'lifetime' ? 'À vie' : '—'}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  {user.is_published
                    ? <span className="text-green-600 text-xs">● Oui</span>
                    : <span className="text-gray-400 text-xs">● Non</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/${user.username}`}
                      target="_blank"
                      className="text-xs text-[#0099FF] hover:underline"
                    >
                      Voir
                    </Link>
                    <button
                      onClick={() => setModalUser(user)}
                      className="text-xs text-amber-600 hover:underline"
                    >
                      Abonnement
                    </button>
                    <button
                      onClick={() => handleBan(user.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Suspendre
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center py-8 text-gray-400 text-sm">Aucun utilisateur trouvé</p>
        )}
      </div>

      {modalUser && (
        <SubscriptionModal
          userId={modalUser.id}
          username={modalUser.username}
          currentType={modalUser.subscription_type}
          onClose={() => setModalUser(null)}
          onSuccess={() => {
            setModalUser(null)
            window.location.reload()
          }}
        />
      )}
    </>
  )
}
