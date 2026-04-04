'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabaseAdmin'
import ReplyForm from '@/components/admin/ReplyForm'

const supabase = getSupabaseClient()

const PRIORITY_COLORS: Record<string, string> = {
  normal: 'bg-gray-700 text-slate-600',
  high: 'bg-yellow-500/20 text-yellow-400',
  urgent: 'bg-red-500/20 text-red-400',
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    loadMessages()
  }, [])

  async function loadMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  async function markAsRead(id: string) {
    await supabase.from('messages').update({ status: 'read' }).eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'read' } : m))
  }

  async function updatePriority(id: string, priority: string) {
    await supabase.from('messages').update({ priority }).eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, priority } : m))
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-slate-500 hover:text-slate-900 text-sm">← Volver</Link>
        <h1 className="text-lg font-bold">Mensajes</h1>
        <span className="text-sm text-slate-400">
          {messages.filter(m => m.status === 'unread').length} sin leer
        </span>
      </header>

      <div className="p-6 max-w-5xl mx-auto space-y-3">
        {loading ? (
          <p className="text-slate-500">Cargando...</p>
        ) : messages.length === 0 ? (
          <p className="text-slate-500">No hay mensajes todavía.</p>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`bg-white border rounded-xl overflow-hidden transition-colors ${msg.status === 'unread' ? 'border-emerald-500/50' : 'border-slate-200'}`}
            >
              <div
                className="p-5 flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer"
                onClick={() => {
                  setExpanded(expanded === msg.id ? null : msg.id)
                  if (msg.status === 'unread') markAsRead(msg.id)
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {msg.status === 'unread' && (
                      <span className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0" />
                    )}
                    <p className="font-semibold text-slate-900">{msg.name}</p>
                  </div>
                  <p className="text-sm text-slate-500">{msg.email}</p>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-1">{msg.body}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full ${PRIORITY_COLORS[msg.priority]}`}>
                    {msg.priority}
                  </span>
                  <select
                    value={msg.priority}
                    onChange={e => { e.stopPropagation(); updatePriority(msg.id, e.target.value) }}
                    onClick={e => e.stopPropagation()}
                    className="text-xs bg-slate-100 border border-slate-300 text-slate-600 rounded-lg px-2 py-1 focus:outline-none"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>
                  <p className="text-xs text-slate-400">
                    {new Date(msg.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              </div>

              {expanded === msg.id && (
                <div className="px-5 pb-5 border-t border-slate-200 pt-4">
                  <p className="text-slate-600 text-sm whitespace-pre-wrap">{msg.body}</p>
                  <ReplyForm to={msg.email} name={msg.name} />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
