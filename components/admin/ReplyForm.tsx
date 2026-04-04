'use client'

import { useState } from 'react'
import { getSupabaseClient } from '@/lib/supabaseAdmin'

interface ReplyFormProps {
  to: string
  name: string
  defaultSubject?: string
}

export default function ReplyForm({ to, name, defaultSubject }: ReplyFormProps) {
  const [subject, setSubject] = useState(defaultSubject || `Re: Tu consulta en Mindbridge IA`)
  const [body, setBody] = useState(`Gracias por contactar con Mindbridge IA.\n\n`)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSend() {
    if (!body.trim()) return
    setSending(true)
    setError('')

    const supabase = getSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    const res = await fetch('/api/admin/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ to, name, subject, body }),
    })

    const data = await res.json()
    setSending(false)

    if (data.success) {
      setSent(true)
    } else {
      setError(data.error || 'Error al enviar')
    }
  }

  if (sent) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-700 font-medium">
        ✓ Email enviado correctamente a {to}
      </div>
    )
  }

  return (
    <div className="space-y-3 mt-4">
      <div>
        <label className="text-xs text-slate-400 mb-1 block">Asunto</label>
        <input
          type="text"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-500"
        />
      </div>
      <div>
        <label className="text-xs text-slate-400 mb-1 block">Mensaje a {name}</label>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          rows={6}
          className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-500 resize-none"
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        onClick={handleSend}
        disabled={sending || !body.trim()}
        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
      >
        {sending ? 'Enviando...' : 'Enviar email'}
      </button>
    </div>
  )
}
