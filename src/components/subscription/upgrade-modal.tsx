'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  onUpgrade: (subscriptionType: string, duration: string) => Promise<void>
}

type Duration = '3months' | '1year' | 'lifetime'

export function SubscriptionUpgradeModal({ isOpen, onClose, onUpgrade }: UpgradeModalProps) {
  const [selectedDuration, setSelectedDuration] = useState<Duration>('1year')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      await onUpgrade('premium', selectedDuration)
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Passer à Premium</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          {/* Features */}
          <div>
            <p className="text-sm text-gray-600 mb-4">Accédez à toutes les fonctionnalités premium :</p>
            <ul className="flex flex-col gap-2">
              {['Liens illimités', 'Couleurs personnalisées', 'Statistiques de visite', 'Sans branding'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-[#0099FF] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Duration selection */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">Durée</p>
            <div className="flex flex-col gap-2">
              {[
                { value: '3months', label: '3 mois', price: '9,99€' },
                { value: '1year', label: '1 an', price: '29,99€' },
                { value: 'lifetime', label: 'À vie', price: '99,99€' },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-colors"
                  style={{
                    borderColor: selectedDuration === option.value ? '#0099FF' : '#E5E7EB',
                    backgroundColor: selectedDuration === option.value ? '#E6F4FF' : 'transparent',
                  }}
                >
                  <input
                    type="radio"
                    name="duration"
                    value={option.value}
                    checked={selectedDuration === option.value as any}
                    onChange={(e) => setSelectedDuration(e.target.value as Duration)}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{option.label}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{option.price}</p>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-900 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-[#0099FF] text-white font-medium rounded-xl hover:bg-[#0077CC] transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Traitement...' : 'Activer Premium'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
