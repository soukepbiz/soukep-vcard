'use client'

import { useState, useEffect } from 'react'
import { LogOut, Trash2, Clock } from 'lucide-react'
import { isPremium } from '@/lib/utils'
import { SubscriptionUpgradeModal } from '@/components/subscription/upgrade-modal'

interface Profile {
  subscription_type: string | null
  subscription_expires_at: string | null
}

interface User {
  email?: string
}

function getExpirationDaysLeft(expiresAt: string | null): number | null {
  if (!expiresAt) return null
  const days = Math.ceil((new Date(expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, days)
}

function formatExpirationDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
}

const BENEFITS = {
  free: ['Profil de base', '5 liens maximum', 'Thème standard'],
  premium: [
    '∞ Liens illimités',
    '🎨 Personnalisation complète (couleurs)',
    '📊 Statistiques détaillées',
    '🎯 Tracking des visiteurs',
    '🌍 Géolocalisation',
    'Support prioritaire',
    'Pas de branding Soukep',
  ],
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/profile')
        if (!res.ok) {
          setError(true)
          return
        }
        const data = await res.json()
        setProfile(data.profile)
        setUser({ email: data.email })
      } catch (err) {
        console.error('Error loading settings:', err)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handleUpgrade = async (subscriptionType: string, duration: string) => {
    try {
      const res = await fetch('/api/user/subscription', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionType, duration }),
      })
      if (!res.ok) throw new Error('Failed to upgrade')

      const updated = await res.json()
      setProfile({
        subscription_type: subscriptionType,
        subscription_expires_at: updated.subscription_expires_at || null,
      })
    } catch (error) {
      console.error('Upgrade failed:', error)
      alert('Erreur lors de la mise à jour de l\'abonnement')
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-20">Chargement...</div>
  }

  if (error || !profile) {
    return <div className="flex items-center justify-center py-20 text-red-600">Erreur au chargement des paramètres</div>
  }

  const premium = isPremium(profile.subscription_type || 'free', profile.subscription_expires_at)
  const daysLeft = getExpirationDaysLeft(profile.subscription_expires_at)
  const isExpiringSoon = daysLeft !== null && daysLeft < 30

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h1 className="text-xl font-bold text-gray-900">Paramètres du compte</h1>

      {/* Compte */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide text-gray-700">Compte</h2>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Email</p>
            <p className="text-sm text-gray-800 font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Type de compte</p>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold ${
              profile?.subscription_type === 'lifetime'
                ? 'bg-purple-100 text-purple-700'
                : premium
                  ? 'bg-[#B3DBFF] text-[#0077CC]'
                  : 'bg-gray-100 text-gray-600'
            }`}>
              {profile?.subscription_type === 'lifetime' ? '⭐ Lifetime' : premium ? '✨ Premium' : 'Gratuit'}
            </span>
          </div>
        </div>
      </div>

      {/* Abonnement */}
      <div className={`rounded-2xl border-2 p-6 ${
        premium
          ? 'bg-gradient-to-br from-[#F0F9FF] to-[#E6F4FF] border-[#B3DBFF]'
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide text-gray-700">Mon abonnement</h2>
          {isExpiringSoon && daysLeft !== null && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-700 rounded-lg">
              <Clock size={12} />
              Expire dans {daysLeft}j
            </span>
          )}
        </div>

        {premium && (
          <div className="bg-white rounded-xl p-4 mb-4 border border-[#B3DBFF]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Statut</span>
              <span className="text-sm font-bold text-[#0077CC]">
                {profile?.subscription_type === 'lifetime' ? 'À vie' : 'Actif jusqu\'au ' + formatExpirationDate(profile?.subscription_expires_at)}
              </span>
            </div>
            {profile?.subscription_type !== 'lifetime' && (
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0099FF]"
                  style={{
                    width: daysLeft ? `${Math.min(100, Math.max(0, (daysLeft / 365) * 100))}%` : '0%',
                  }}
                />
              </div>
            )}
          </div>
        )}

        {!premium ? (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Débloquez l'accès complet à toutes les fonctionnalités Premium.
            </p>
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="w-full px-4 py-3 bg-gradient-to-r from-[#0099FF] to-[#0077CC] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Passer à Premium
            </button>
          </div>
        ) : profile?.subscription_type !== 'lifetime' ? (
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="w-full px-4 py-2 text-sm bg-white border border-[#0099FF] text-[#0077CC] font-semibold rounded-xl hover:bg-[#F0F9FF] transition-colors"
          >
            Renouveler l'abonnement
          </button>
        ) : null}
      </div>

      {/* Avantages */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide text-gray-700">Avantages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free */}
          <div className="p-4 border border-gray-200 rounded-xl">
            <p className="text-sm font-bold text-gray-700 mb-3">Plan Gratuit</p>
            <ul className="space-y-2">
              {BENEFITS.free.map((b) => (
                <li key={b} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="text-gray-400 mt-0.5">○</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Premium */}
          <div className="p-4 bg-[#F0F9FF] border border-[#B3DBFF] rounded-xl">
            <p className="text-sm font-bold text-[#0077CC] mb-3">Plan Premium</p>
            <ul className="space-y-2">
              {BENEFITS.premium.map((b) => (
                <li key={b} className="flex items-start gap-2 text-xs text-[#0077CC] font-medium">
                  <span className="text-[#0099FF] mt-0.5">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Sécurité */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide text-gray-700">Sécurité</h2>
        <button className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
          <LogOut size={16} />
          Déconnecter toutes les sessions
        </button>
        <p className="text-xs text-gray-500 mt-2">Cela fermera votre session sur tous vos appareils.</p>
      </div>

      {/* Zone dangereuse */}
      <div className="bg-white rounded-2xl border border-red-100 p-6">
        <h2 className="text-sm font-bold text-red-700 mb-4 uppercase tracking-wide">Zone dangereuse</h2>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} />
            Supprimer mon compte
          </button>
        ) : (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm font-semibold text-red-700 mb-3">Êtes-vous sûr ?</p>
            <p className="text-xs text-red-600 mb-4">
              Cette action est irréversible. Tous vos profils et données seront supprimés définitivement.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-3 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-white transition-colors"
              >
                Annuler
              </button>
              <button
                className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      <SubscriptionUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onUpgrade={handleUpgrade}
      />
    </div>
  )
}
