'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Mail, Lock, CheckCircle2, UserPlus } from 'lucide-react'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
  const strengthLabel = ['', 'Faible', 'Correct', 'Fort']
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-emerald-500']

  function translateError(msg: string): string {
    if (msg.includes('already registered') || msg.includes('already been registered')) return 'Cette adresse email est déjà utilisée. Essayez de vous connecter.'
    if (msg.includes('Invalid email')) return 'Adresse email invalide.'
    if (msg.includes('Password should be')) return 'Le mot de passe doit contenir au moins 6 caractères.'
    if (msg.includes('rate limit') || msg.includes('too many')) return 'Trop de tentatives. Veuillez réessayer dans quelques minutes.'
    if (msg.includes('Unable to validate') || msg.includes('signup is disabled')) return "Les inscriptions sont désactivées pour le moment."
    return msg
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    })
    if (error) {
      setError(translateError(error.message))
    } else if (data.user && data.session) {
      // Email confirmation disabled — user is directly logged in
      window.location.href = '/dashboard'
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center py-4 flex flex-col items-center gap-3">
        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-emerald-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-1">Vérifiez votre email</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Un lien de confirmation a été envoyé à<br />
            <strong className="text-gray-800">{email}</strong>
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="signup-email" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Adresse email
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="signup-email"
            type="email"
            placeholder="vous@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:border-transparent focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="signup-password" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Mot de passe
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Minimum 8 caractères"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
            className="w-full h-11 pl-10 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0099FF] focus:border-transparent focus:bg-white transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {password.length > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex gap-1 flex-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor[strength] : 'bg-gray-200'}`} />
              ))}
            </div>
            <span className={`text-xs font-medium ${strength === 1 ? 'text-red-500' : strength === 2 ? 'text-amber-500' : 'text-emerald-600'}`}>
              {strengthLabel[strength]}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 flex items-center justify-center gap-2 h-12 w-full bg-[#0099FF] hover:bg-[#0077CC] text-white font-semibold rounded-xl text-sm transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-[#B3DBFF]"
      >
        {loading ? (
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            Créer mon compte
          </>
        )}
      </button>
    </form>
  )
}
