'use client'

import { useState } from 'react'

export default function SoportePage() {
  const [form, setForm] = useState({ name: '', email: '', service: '', description: '', priority: 'normal' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError('')

    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setSent(true)
      } else {
        setError(data.error || 'Error al enviar la incidencia')
      }
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.')
    }
    setSending(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Incidencia registrada</h2>
          <p className="text-slate-400 text-sm">Hemos recibido tu incidencia. Recibirás una respuesta en breve en <strong className="text-white">{form.email}</strong>.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Soporte técnico</h1>
          <p className="text-slate-400 text-sm">Describe tu problema y te ayudamos lo antes posible</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Nombre</label>
              <input
                required
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Servicio afectado</label>
            <input
              value={form.service}
              onChange={e => setForm(p => ({ ...p, service: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
              placeholder="Ej: Web, Chatbot IA, Panel admin..."
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Urgencia</label>
            <select
              value={form.priority}
              onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="normal">Normal — funciona pero con problemas</option>
              <option value="high">Alta — afecta al negocio</option>
              <option value="urgent">Urgente — servicio caído</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Descripción del problema</label>
            <textarea
              required
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={4}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 resize-none"
              placeholder="Describe qué está pasando, cuándo empezó y qué has intentado..."
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={sending}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
          >
            {sending ? 'Enviando...' : 'Enviar incidencia'}
          </button>
        </form>
      </div>
    </div>
  )
}
