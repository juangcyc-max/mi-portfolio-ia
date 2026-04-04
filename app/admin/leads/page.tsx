'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabaseAdmin'

const supabase = getSupabaseClient()

const STATUS_LABELS: Record<string, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  qualified: 'Cualificado',
  proposal_sent: 'Propuesta enviada',
  won: 'Cerrado',
  lost: 'Perdido',
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-emerald-500/20 text-emerald-400',
  contacted: 'bg-blue-500/20 text-blue-400',
  qualified: 'bg-purple-500/20 text-purple-400',
  proposal_sent: 'bg-yellow-500/20 text-yellow-400',
  won: 'bg-green-500/20 text-green-400',
  lost: 'bg-red-500/20 text-red-400',
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    loadLeads()
  }, [])

  async function loadLeads() {
    const { data } = await supabase
      .from('leads')
      .select('*, messages(body)')
      .order('created_at', { ascending: false })
    setLeads(data || [])
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('leads').update({ status }).eq('id', id)
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }

  async function deleteLead(id: string) {
    await supabase.from('messages').delete().eq('lead_id', id)
    await supabase.from('leads').delete().eq('id', id)
    setLeads(prev => prev.filter(l => l.id !== id))
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-slate-500 hover:text-slate-900 text-sm">← Volver</Link>
        <h1 className="text-lg font-bold">Leads</h1>
        <span className="text-sm text-slate-400">{leads.length} total</span>
      </header>

      <div className="p-6 max-w-5xl mx-auto">
        {loading ? (
          <p className="text-slate-500">Cargando...</p>
        ) : leads.length === 0 ? (
          <p className="text-slate-500">No hay leads todavía.</p>
        ) : (
          <div className="space-y-3">
            {leads.map(lead => {
              const message = lead.messages?.[0]?.body
              const isExpanded = expanded === lead.id
              return (
                <div key={lead.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div
                    className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setExpanded(isExpanded ? null : lead.id)}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{lead.name}</p>
                      <p className="text-sm text-slate-500">{lead.email}</p>
                      {message && (
                        <p className="text-sm text-slate-400 mt-1 line-clamp-1">{message}</p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(lead.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        {lead.source ? ` · ${lead.source}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[lead.status] || 'bg-gray-200 text-slate-600'}`}>
                        {STATUS_LABELS[lead.status] || lead.status}
                      </span>
                      <select
                        value={lead.status}
                        onChange={e => { e.stopPropagation(); updateStatus(lead.id, e.target.value) }}
                        onClick={e => e.stopPropagation()}
                        className="text-xs bg-slate-100 border border-slate-300 text-slate-600 rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500"
                      >
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <button
                        onClick={e => { e.stopPropagation(); if (confirm('¿Borrar este lead?')) deleteLead(lead.id) }}
                        className="text-slate-400 hover:text-red-500 transition-colors text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-slate-200 pt-4">
                      {message ? (
                        <p className="text-slate-600 text-sm whitespace-pre-wrap mb-4">{message}</p>
                      ) : (
                        <p className="text-slate-400 text-sm italic mb-4">Sin mensaje</p>
                      )}
                      <a
                        href={`mailto:${lead.email}?subject=Re: Tu consulta en Mindbridge IA&body=Hola ${lead.name},%0A%0A`}
                        onClick={() => updateStatus(lead.id, 'contacted')}
                        className="inline-flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Responder por email
                      </a>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
