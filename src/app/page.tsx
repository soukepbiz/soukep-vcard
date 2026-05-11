'use client'

import { useState } from 'react'
import { LoginForm } from '@/components/auth/login-form'
import { SignupForm } from '@/components/auth/signup-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Smartphone, BarChart3 } from 'lucide-react'
import Image from 'next/image'

const features = [
  { icon: Palette, label: 'Design personnalisé', desc: 'Couleurs et style uniques' },
  { icon: Smartphone, label: 'Ajout aux contacts', desc: 'Compatible iOS & Android' },
  { icon: BarChart3, label: 'Statistiques', desc: 'Suivez vos visites' },
]

export default function LandingPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login')

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Left panel — hidden on mobile */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] min-h-screen bg-[#0099FF] p-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Image src="/logo-st.png" alt="Soukep" width={36} height={36} className="rounded-lg brightness-0 invert" />
          <span className="font-bold text-white text-lg tracking-tight">Soukep vCard</span>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            Votre identité professionnelle,<br />en un lien.
          </h2>
          <p className="text-[#B3DBFF] text-sm leading-relaxed mb-8">
            Créez une carte de visite digitale élégante, partagez-la en un instant et laissez vos contacts vous ajouter directement depuis leur téléphone.
          </p>
          <div className="flex flex-col gap-4">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{f.label}</p>
                  <p className="text-xs text-[#80C2FF]">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-[#80C2FF]">
          &copy; {new Date().getFullYear()} Soukep vCard. Tous droits réservés.
        </p>
      </div>

      {/* Right panel — auth */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-screen">
        {/* Mobile logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden flex items-center gap-2.5 mb-8"
        >
          <Image src="/logo-st.png" alt="Soukep" width={32} height={32} className="rounded-lg" />
          <span className="font-bold text-gray-900 text-lg tracking-tight">Soukep vCard</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="w-full max-w-[400px]"
        >
          {/* Title */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {tab === 'login' ? 'Bon retour.' : 'Créez votre compte.'}
            </h1>
            <p className="text-sm text-gray-500">
              {tab === 'login'
                ? 'Connectez-vous pour accéder à votre carte.'
                : 'Rejoignez Soukep vCard gratuitement.'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {(['login', 'signup'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  tab === t
                    ? 'bg-white text-gray-900 shadow-sm shadow-gray-200'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {t === 'login' ? 'Connexion' : 'Inscription'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {tab === 'login' ? <LoginForm /> : <SignupForm />}
            </motion.div>
          </AnimatePresence>

          <p className="mt-5 text-center text-xs text-gray-400">
            {tab === 'login' ? (
              <>Pas encore de compte ?{' '}
                <button onClick={() => setTab('signup')} className="text-[#0099FF] font-semibold hover:underline">
                  S&apos;inscrire
                </button>
              </>
            ) : (
              <>Déjà inscrit ?{' '}
                <button onClick={() => setTab('login')} className="text-[#0099FF] font-semibold hover:underline">
                  Se connecter
                </button>
              </>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
