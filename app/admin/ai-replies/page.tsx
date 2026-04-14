'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabaseAdmin'

const supabase = getSupabaseClient()

export default function AIRepliesPage() {
  const [replies, setReplies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => { loadReplies() }, [])

  async function loadReplies() {
    const { data } = await supabase
      .from('ai_replies')
      .select('*')
      .order('sent_at', { ascending: false })
    setReplies(data || [])
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-slate-500 hover:text-slate-900 text-sm">← Volver</Link>
        <h1 className="text-lg font-bold">Respuestas IA</h1>
        <span className="text-sm text-slate-400">{replies.length} enviadas</span>
      </header>

      <div className="p-6 max-w-5xl mx-auto space-y-3">
        {loading ? <p className="text-slate-500">Cargando...</p>
          : replies.length === 0 ? <p className="text-slate-500">No hay respuestas IA todavía.</p>
          : replies.map(reply => (
            <div key={reply.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div
                className="p-5 flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpanded(expanded === reply.id ? null : reply.id)}
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{reply.to_name}</p>
                  <p className="text-sm text-slate-500">{reply.to_email}</p>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-1">{reply.original_message}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs bg-purple-500/20 text-purple-600 px-3 py-1 rounded-full font-medium">IA respondió</span>
                  <p className="text-xs text-slate-400">
                    {new Date(reply.sent_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              {expanded === reply.id && (
                <div className="px-5 pb-5 border-t border-slate-200 pt-4 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 mb-2">Mensaje del cliente</p>
                      <p className="text-sm text-slate-600 whitespace-pre-wrap">{reply.original_message}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-2">Respuesta enviada por IA</p>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{reply.ai_response}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={async () => {
                        const res = await fetch('/api/admin/delete-ai-reply', {
                          method: 'DELETE',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id: reply.id }),
                        })
                        if (res.ok) setReplies(prev => prev.filter(r => r.id !== reply.id))
                      }}
                      className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-semibold"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
