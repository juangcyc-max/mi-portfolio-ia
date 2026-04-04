'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabaseAdmin'
import ReplyForm from '@/components/admin/ReplyForm'

const supabase = getSupabaseClient()

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-red-500/20 text-red-500',
  ai_handled: 'bg-emerald-500/20 text-emerald-600',
  in_progress: 'bg-yellow-500/20 text-yellow-600',
  resolved: 'bg-slate-200 text-slate-500',
}
const STATUS_LABELS: Record<string, string> = {
  open: 'Abierta',
  ai_handled: 'Resuelta por IA',
  in_progress: 'En progreso',
  resolved: 'Resuelta',
}
const PRIORITY_COLORS: Record<string, string> = {
  normal: 'bg-slate-200 text-slate-600',
  high: 'bg-yellow-500/20 text-yellow-600',
  urgent: 'bg-red-500/20 text-red-500',
}
const PRIORITY_LABELS: Record<string, string> = {
  normal: 'Normal',
  high: 'Alta',
  urgent: 'Urgente',
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => { loadIncidents() }, [])

  async function loadIncidents() {
    const { data } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false })
    setIncidents(data || [])
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('incidents').update({ status, resolved_at: status === 'resolved' ? new Date().toISOString() : null }).eq('id', id)
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-slate-500 hover:text-slate-900 text-sm">← Volver</Link>
        <h1 className="text-lg font-bold">Incidencias</h1>
        <span className="text-sm text-red-500 font-medium">
          {incidents.filter(i => i.status === 'open').length} abiertas
        </span>
      </header>

      <div className="p-6 max-w-5xl mx-auto space-y-3">
        {loading ? <p className="text-slate-500">Cargando...</p>
          : incidents.length === 0 ? <p className="text-slate-500">No hay incidencias todavía.</p>
          : incidents.map(inc => (
            <div key={inc.id} className={`bg-white border rounded-xl overflow-hidden ${inc.status === 'open' && inc.priority === 'urgent' ? 'border-red-300' : 'border-slate-200'}`}>
              <div
                className="p-5 flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpanded(expanded === inc.id ? null : inc.id)}
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{inc.client_name}</p>
                  <p className="text-sm text-slate-500">{inc.client_email}</p>
                  {inc.service && <p className="text-xs text-slate-400">Servicio: {inc.service}</p>}
                  <p className="text-sm text-slate-400 mt-1 line-clamp-1">{inc.description}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(inc.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${PRIORITY_COLORS[inc.priority]}`}>
                    {PRIORITY_LABELS[inc.priority]}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[inc.status]}`}>
                    {STATUS_LABELS[inc.status]}
                  </span>
                  <select
                    value={inc.status}
                    onChange={e => { e.stopPropagation(); updateStatus(inc.id, e.target.value) }}
                    onClick={e => e.stopPropagation()}
                    className="text-xs bg-slate-100 border border-slate-300 text-slate-600 rounded-lg px-2 py-1 focus:outline-none"
                  >
                    {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>

              {expanded === inc.id && (
                <div className="px-5 pb-5 border-t border-slate-200 pt-4 space-y-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Descripción completa</p>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{inc.description}</p>
                  </div>
                  {inc.ai_response && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <p className="text-xs text-emerald-600 font-medium mb-1">Respuesta enviada por IA</p>
                      <p className="text-sm text-emerald-800 whitespace-pre-wrap">{inc.ai_response}</p>
                    </div>
                  )}
                  {inc.status !== 'resolved' && (
                    <div>
                      <p className="text-xs text-slate-400 mb-2">Responder manualmente</p>
                      <ReplyForm
                        to={inc.client_email}
                        name={inc.client_name}
                        defaultSubject={`Re: Tu incidencia en Mindbridge IA`}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
