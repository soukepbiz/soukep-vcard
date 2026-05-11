'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface SubscriptionModalProps {
  userId: string
  username: string
  currentType: string
  onClose: () => void
  onSuccess: () => void
}

type Duration = '3months' | '1year' | 'lifetime'

export function SubscriptionModal({ userId, username, currentType, onClose, onSuccess }: SubscriptionModalProps) {
  const [subType, setSubType] = useState<'free' | 'premium' | 'lifetime'>(
    currentType as 'free' | 'premium' | 'lifetime'
  )
  const [duration, setDuration] = useState<Duration>('1year')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/subscription', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, subscriptionType: subType, duration: subType === 'lifetime' ? 'lifetime' : duration }),
    })
    if (res.ok) {
      onSuccess()
    } else {
      const data = await res.json()
      setError(data.error || 'Erreur')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 className="font-bold text-gray-900 mb-1">Modifier l&apos;abonnement</h3>
        <p className="text-sm text-gray-500 mb-5">@{username}</p>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Type</p>
            <div className="flex gap-2">
              {(['free', 'premium', 'lifetime'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSubType(t)}
                  className={`flex-1 py-2 text-sm font-medium rounded-xl border transition-all ${
                    subType === t
                      ? 'bg-[#0099FF] text-white border-[#0099FF]'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {t === 'free' ? 'Free' : t === 'premium' ? 'Premium' : 'Lifetime'}
                </button>
              ))}
            </div>
          </div>

          {subType === 'premium' && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Durée</p>
              <div className="flex gap-2">
                {([['3months', '3 mois'], ['1year', '1 an'], ['lifetime', 'À vie']] as [Duration, string][]).map(([d, label]) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`flex-1 py-2 text-sm font-medium rounded-xl border transition-all ${
                      duration === d
                        ? 'bg-[#E6F4FF] text-[#0077CC] border-[#80C2FF]'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex gap-2 mt-2">
            <Button onClick={handleSubmit} loading={loading} className="flex-1">
              Appliquer
            </Button>
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Annuler
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
