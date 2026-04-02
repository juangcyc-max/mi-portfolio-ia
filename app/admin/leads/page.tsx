'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

  useEffect(() => {
    loadLeads()
  }, [])

  async function loadLeads() {
    const { data } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    setLeads(data || [])
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('leads').update({ status }).eq('id', id)
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-gray-400 hover:text-white text-sm">← Volver</Link>
        <h1 className="text-lg font-bold">Leads</h1>
        <span className="text-sm text-gray-500">{leads.length} total</span>
      </header>

      <div className="p-6 max-w-5xl mx-auto">
        {loading ? (
          <p className="text-gray-400">Cargando...</p>
        ) : leads.length === 0 ? (
          <p className="text-gray-400">No hay leads todavía.</p>
        ) : (
          <div className="space-y-3">
            {leads.map(lead => (
              <div key={lead.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-white">{lead.name}</p>
                  <p className="text-sm text-gray-400">{lead.email}</p>
                  {lead.company && <p className="text-sm text-gray-500">{lead.company}</p>}
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(lead.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    {' · '}{lead.source}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[lead.status] || 'bg-gray-700 text-gray-300'}`}>
                    {STATUS_LABELS[lead.status] || lead.status}
                  </span>
                  <select
                    value={lead.status}
                    onChange={e => updateStatus(lead.id, e.target.value)}
                    className="text-xs bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500"
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
