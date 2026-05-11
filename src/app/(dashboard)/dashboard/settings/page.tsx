import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isPremium } from '@/lib/utils'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_type, subscription_expires_at, username')
    .eq('id', user.id)
    .single()

  const premium = profile ? isPremium(profile.subscription_type, profile.subscription_expires_at) : false

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <h1 className="text-xl font-bold text-gray-900">Paramètres du compte</h1>

      {/* Account info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-gray-900">Informations du compte</h2>
        <div>
          <p className="text-xs text-gray-500 mb-1">Email</p>
          <p className="text-sm text-gray-800">{user.email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Abonnement</p>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            premium ? 'bg-[#B3DBFF] text-[#0077CC]' : 'bg-gray-100 text-gray-600'
          }`}>
            {profile?.subscription_type === 'lifetime' ? 'Lifetime' : premium ? 'Premium' : 'Free'}
          </span>
          {profile?.subscription_expires_at && (
            <p className="text-xs text-gray-400 mt-1">
              Expire le {new Date(profile.subscription_expires_at).toLocaleDateString('fr-FR')}
            </p>
          )}
        </div>
      </div>

      {/* Upgrade */}
      {!premium && (
        <div className="bg-gradient-to-br from-[#0099FF] to-[#0077CC] rounded-2xl p-5 text-white">
          <h2 className="font-bold mb-1">Passer à Premium</h2>
          <p className="text-sm text-[#E6F4FF] mb-4">
            Liens illimités, personnalisation complète et statistiques de visite.
          </p>
          <ul className="text-sm text-[#E6F4FF] flex flex-col gap-1.5 mb-5">
            {['Liens illimités', 'Couleurs personnalisées', 'Statistiques', 'Sans branding'].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#80C2FF] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <a
            href="/api/stripe/checkout"
            className="inline-flex items-center justify-center h-11 px-6 bg-white text-[#0077CC] font-semibold rounded-xl text-sm hover:bg-[#E6F4FF] transition-colors"
          >
            Upgrader maintenant
          </a>
        </div>
      )}

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-red-100 p-5 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-red-700">Zone dangereuse</h2>
        <p className="text-xs text-gray-500">La suppression du compte est irréversible.</p>
        <button className="self-start px-4 py-2 text-sm text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
          Supprimer mon compte
        </button>
      </div>
    </div>
  )
}
