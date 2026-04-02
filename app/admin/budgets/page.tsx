'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabaseAdmin'

const supabase = getSupabaseClient()

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  processing: 'Procesando',
  sent: 'Enviado',
  accepted: 'Aceptado',
  rejected: 'Rechazado',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  processing: 'bg-blue-500/20 text-blue-400',
  sent: 'bg-purple-500/20 text-purple-400',
  accepted: 'bg-emerald-500/20 text-emerald-400',
  rejected: 'bg-red-500/20 text-red-400',
}

export default function BudgetsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    loadRequests()
  }, [])

  async function loadRequests() {
    const { data } = await supabase
      .from('budget_requests')
      .select('*')
      .order('created_at', { ascending: false })
    setRequests(data || [])
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('budget_requests').update({ status }).eq('id', id)
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-slate-500 hover:text-slate-900 text-sm">← Volver</Link>
        <h1 className="text-lg font-bold">Presupuestos</h1>
        <span className="text-sm text-slate-400">{requests.length} solicitudes</span>
      </header>

      <div className="p-6 max-w-5xl mx-auto space-y-3">
        {loading ? (
          <p className="text-slate-500">Cargando...</p>
        ) : requests.length === 0 ? (
          <p className="text-slate-500">No hay solicitudes de presupuesto todavía.</p>
        ) : (
          requests.map(req => (
            <div key={req.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div
                className="p-5 flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer"
                onClick={() => setExpanded(expanded === req.id ? null : req.id)}
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{req.name}</p>
                  <p className="text-sm text-slate-500">{req.email}</p>
                  {req.company && <p className="text-sm text-slate-400">{req.company}</p>}
                  <p className="text-xs text-slate-400 mt-1">
                    {req.project_type && `${req.project_type} · `}
                    {req.budget_range && `Presupuesto: ${req.budget_range} · `}
                    {new Date(req.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[req.status] || 'bg-gray-700 text-slate-600'}`}>
                    {STATUS_LABELS[req.status] || req.status}
                  </span>
                  <select
                    value={req.status}
                    onChange={e => { e.stopPropagation(); updateStatus(req.id, e.target.value) }}
                    onClick={e => e.stopPropagation()}
                    className="text-xs bg-slate-100 border border-slate-300 text-slate-600 rounded-lg px-2 py-1 focus:outline-none"
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {expanded === req.id && (
                <div className="px-5 pb-5 border-t border-slate-200 pt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Tipo de proyecto</p>
                    <p className="text-slate-700">{req.project_type || '—'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Plazo</p>
                    <p className="text-slate-700">{req.timeline || '—'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Presupuesto estimado</p>
                    <p className="text-slate-700">{req.budget_range || '—'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Teléfono</p>
                    <p className="text-slate-700">{req.phone || '—'}</p>
                  </div>
                  {req.additional_info && (
                    <div className="col-span-2">
                      <p className="text-slate-400 text-xs mb-1">Info adicional</p>
                      <p className="text-slate-700 whitespace-pre-wrap">{req.additional_info}</p>
                    </div>
                  )}
                  <div className="col-span-2 flex gap-3 mt-2">
                    <a
                      href={`mailto:${req.email}?subject=Presupuesto Mindbridge IA`}
                      className="text-sm bg-emerald-600 hover:bg-emerald-500 text-slate-900 px-4 py-2 rounded-lg transition-colors"
                    >
                      Responder por email
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
