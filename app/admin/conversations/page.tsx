'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabaseAdmin'

const supabase = getSupabaseClient()

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-emerald-500/20 text-emerald-400',
  closed: 'bg-gray-700 text-slate-500',
  escalated: 'bg-red-500/20 text-red-400',
}

const STATUS_LABELS: Record<string, string> = {
  open: 'Abierta',
  closed: 'Cerrada',
  escalated: 'Escalada',
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [messages, setMessages] = useState<Record<string, any[]>>({})
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    loadConversations()
  }, [])

  async function loadConversations() {
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .order('created_at', { ascending: false })
    setConversations(data || [])
    setLoading(false)
  }

  async function loadMessages(conversationId: string) {
    if (messages[conversationId]) return
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    setMessages(prev => ({ ...prev, [conversationId]: data || [] }))
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('conversations').update({ status }).eq('id', id)
    setConversations(prev => prev.map(c => c.id === id ? { ...c, status } : c))
  }

  function toggleExpand(id: string) {
    if (expanded === id) {
      setExpanded(null)
    } else {
      setExpanded(id)
      loadMessages(id)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-slate-500 hover:text-slate-900 text-sm">← Volver</Link>
        <h1 className="text-lg font-bold">Conversaciones</h1>
        <span className="text-sm text-slate-400">
          {conversations.filter(c => c.status === 'open').length} abiertas
        </span>
      </header>

      <div className="p-6 max-w-5xl mx-auto space-y-3">
        {loading ? (
          <p className="text-slate-500">Cargando...</p>
        ) : conversations.length === 0 ? (
          <p className="text-slate-500">No hay conversaciones todavía.</p>
        ) : (
          conversations.map(conv => (
            <div key={conv.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div
                className="p-5 flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer"
                onClick={() => toggleExpand(conv.id)}
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 text-sm">
                    Sesión: <span className="text-slate-500 font-mono">{conv.session_id.slice(0, 12)}...</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {conv.channel} · {new Date(conv.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[conv.status] || 'bg-gray-700 text-slate-600'}`}>
                    {STATUS_LABELS[conv.status] || conv.status}
                  </span>
                  <select
                    value={conv.status}
                    onChange={e => { e.stopPropagation(); updateStatus(conv.id, e.target.value) }}
                    onClick={e => e.stopPropagation()}
                    className="text-xs bg-slate-100 border border-slate-300 text-slate-600 rounded-lg px-2 py-1 focus:outline-none"
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {expanded === conv.id && (
                <div className="border-t border-slate-200 px-5 py-4 space-y-3 max-h-96 overflow-y-auto">
                  {(messages[conv.id] || []).length === 0 ? (
                    <p className="text-slate-400 text-sm">Sin mensajes registrados.</p>
                  ) : (
                    (messages[conv.id] || []).map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                          msg.role === 'user'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-emerald-600/20 text-emerald-200 border border-emerald-500/30'
                        }`}>
                          <p className="text-xs opacity-60 mb-1">{msg.role === 'user' ? 'Visitante' : 'IA'}</p>
                          <p>{msg.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
