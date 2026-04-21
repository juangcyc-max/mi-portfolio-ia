'use client'

import { useState } from 'react'
import { getSupabaseClient } from '@/lib/supabaseAdmin'

const supabase = getSupabaseClient()

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'reset'>('login')
  const [resetSent, setResetSent] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }
    window.location.href = '/admin'
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://mindbride.net/auth/confirm',
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setResetSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-2xl border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Mindbridge IA</h1>
          <p className="text-gray-400 mt-1 text-sm">Panel de administración</p>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <button
              type="button"
              onClick={() => { setMode('reset'); setError('') }}
              className="w-full text-sm text-gray-500 hover:text-gray-300 transition-colors pt-1"
            >
              Olvidé mi contraseña
            </button>
          </form>
        ) : resetSent ? (
          <div className="text-center space-y-4">
            <p className="text-emerald-400 font-semibold">Email enviado ✓</p>
            <p className="text-gray-400 text-sm">Revisa tu bandeja de entrada y haz click en el enlace para cambiar la contraseña.</p>
            <button
              onClick={() => { setMode('login'); setResetSent(false) }}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Volver al login
            </button>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <p className="text-gray-400 text-sm">Introduce tu email y te enviamos un enlace para restablecer la contraseña.</p>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                placeholder="tu@email.com"
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setError('') }}
              className="w-full text-sm text-gray-500 hover:text-gray-300 transition-colors pt-1"
            >
              Volver al login
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
