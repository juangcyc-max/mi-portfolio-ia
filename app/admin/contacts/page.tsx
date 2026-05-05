'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabaseAdmin'
import ReplyForm from '@/components/admin/ReplyForm'

const supabase = getSupabaseClient()

const STATUS_COLORS: Record<string, string> = {
  new:           'bg-emerald-500/10 text-emerald-600',
  contacted:     'bg-blue-500/10 text-blue-600',
  qualified:     'bg-purple-500/10 text-purple-600',
  proposal_sent: 'bg-yellow-500/10 text-yellow-600',
  won:           'bg-green-500/10 text-green-700',
  lost:          'bg-red-500/10 text-red-500',
}
const STATUS_LABELS: Record<string, string> = {
  new:           'Nuevo',
  contacted:     'Contactado',
  qualified:     'Cualificado',
  proposal_sent: 'Propuesta',
  won:           'Ganado',
  lost:          'Perdido',
}

type Message = { id: string; body: string; status: string; created_at: string }
type Lead = {
  id: string; name: string; email: string; status: string
  source: string | null; created_at: string
  messages: Message[]
}

export default function ContactsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread' | 'new'>('all')

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase
      .from('leads')
      .select('*, messages(id, body, status, created_at)')
      .order('created_at', { ascending: false })
    setLeads((data as Lead[]) ?? [])
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('leads').update({ status }).eq('id', id)
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }

  async function markMessagesRead(leadId: string) {
    await supabase.from('messages').update({ status: 'read' }).eq('lead_id', leadId).eq('status', 'unread')
    setLeads(prev => prev.map(l =>
      l.id === leadId
        ? { ...l, messages: l.messages.map(m => ({ ...m, status: 'read' })) }
        : l
    ))
  }

  async function deleteLead(id: string) {
    if (!confirm('¿Eliminar este contacto y todos sus mensajes?')) return
    await supabase.from('messages').delete().eq('lead_id', id)
    await supabase.from('leads').delete().eq('id', id)
    setLeads(prev => prev.filter(l => l.id !== id))
  }

  const hasUnread = (lead: Lead) => lead.messages.some(m => m.status === 'unread')

  const filtered = leads.filter(l => {
    if (filter === 'unread') return hasUnread(l)
    if (filter === 'new')    return l.status === 'new'
    return true
  })

  const unreadCount = leads.filter(hasUnread).length
  const newCount    = leads.filter(l => l.status === 'new').length

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 px-6 py-4 flex items-center gap-4 bg-white sticky top-0 z-10">
        <Link href="/admin" className="text-slate-500 hover:text-slate-900 text-sm">← Volver</Link>
        <h1 className="text-lg font-bold">Contactos</h1>
        <span className="text-sm text-slate-400">{leads.length} total</span>
      </header>

      {/* Filtros */}
      <div className="px-6 pt-4 pb-2 flex gap-2">
        {([
          ['all',    'Todos',         leads.length],
          ['unread', 'Sin leer',      unreadCount],
          ['new',    'Nuevos leads',  newCount],
        ] as const).map(([key, label, count]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
              filter === key
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}
          >
            {label} <span className="opacity-60">({count})</span>
          </button>
        ))}
      </div>

      <div className="p-6 max-w-5xl mx-auto space-y-3">
        {loading ? (
          <p className="text-slate-500">Cargando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-slate-400 text-sm">No hay contactos que coincidan.</p>
        ) : (
          filtered.map(lead => (
            <ContactCard
              key={lead.id}
              lead={lead}
              isExpanded={expanded === lead.id}
              onToggle={() => {
                setExpanded(expanded === lead.id ? null : lead.id)
                if (expanded !== lead.id) markMessagesRead(lead.id)
              }}
              onStatusChange={s => updateStatus(lead.id, s)}
              onDelete={() => deleteLead(lead.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

type CardProps = {
  lead: Lead
  isExpanded: boolean
  onToggle: () => void
  onStatusChange: (s: string) => void
  onDelete: () => void
}

function ContactCard({ lead, isExpanded, onToggle, onStatusChange, onDelete }: CardProps) {
  const lastMsg = lead.messages[0]
  const unreadCount = lead.messages.filter(m => m.status === 'unread').length

  return (
    <div className={`bg-white border rounded-xl overflow-hidden ${unreadCount > 0 ? 'border-emerald-400' : 'border-slate-200'}`}>
      <div
        className="p-5 flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <span className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0" />
            )}
            <p className="font-semibold text-slate-900">{lead.name}</p>
          </div>
          <p className="text-sm text-slate-500">{lead.email}</p>
          {lastMsg && (
            <p className="text-sm text-slate-400 mt-1 line-clamp-1">{lastMsg.body}</p>
          )}
          <p className="text-xs text-slate-400 mt-1">
            {new Date(lead.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            {lead.source && ` · ${lead.source}`}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">{unreadCount} nuevo{unreadCount > 1 ? 's' : ''}</span>
            )}
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[lead.status] ?? 'bg-slate-100 text-slate-500'}`}>
              {STATUS_LABELS[lead.status] ?? lead.status}
            </span>
            <button onClick={e => { e.stopPropagation(); onDelete() }} className="text-slate-300 hover:text-red-500 transition-colors text-sm ml-1">✕</button>
          </div>

          <div className="flex gap-1 flex-wrap justify-end" onClick={e => e.stopPropagation()}>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <button
                key={value}
                onClick={() => onStatusChange(value)}
                className={`text-[10px] px-2 py-1 rounded-lg font-semibold border transition-colors ${
                  lead.status === value
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-5 pb-5 border-t border-slate-200 pt-4 space-y-4">
          {/* Hilo de mensajes */}
          {lead.messages.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-slate-400 font-semibold uppercase">Mensajes</p>
              {lead.messages.map(msg => (
                <div key={msg.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{msg.body}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(msg.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          )}

          <ReplyForm to={lead.email} name={lead.name} />
        </div>
      )}
    </div>
  )
}
