'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabaseAdmin'
import StatCard from '@/components/admin/StatCard'
import NavCard from '@/components/admin/NavCard'
import NavGroup from '@/components/admin/NavGroup'
import ActivityRow, { ActivityItem } from '@/components/admin/ActivityRow'
import MiniChart from '@/components/admin/MiniChart'

const supabase = getSupabaseClient()

type FacturaRow = { pagos: { pagado: boolean; fecha: string }[] }
type LeadRow = { id: string; name: string; email: string; created_at: string }
type MessageRow = { id: string; name: string; body: string; created_at: string }
type IncidentRow = { id: string; client_name: string; description: string; created_at: string }

type Stats = {
  leads: number; unreadMessages: number; pendingBudgets: number
  conversations: number; pageViews: number; aiReplies: number
  incidents: number; cobrosPendientes: number; cobrosVencidos: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    leads: 0, unreadMessages: 0, pendingBudgets: 0,
    conversations: 0, pageViews: 0, aiReplies: 0,
    incidents: 0, cobrosPendientes: 0, cobrosVencidos: 0,
  })
  const [trends, setTrends] = useState({ leads: { value: 0, positive: true }, messages: { value: 0, positive: true } })
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [chartData, setChartData] = useState<{ day: string; count: number }[]>([])

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const now = new Date()
    const weekAgo      = new Date(now.getTime() - 7  * 86400000).toISOString()
    const twoWeeksAgo  = new Date(now.getTime() - 14 * 86400000).toISOString()
    const hoy = now.toISOString().split('T')[0]

    const [
      { count: leads }, { count: unreadMessages }, { count: pendingBudgets },
      { count: conversations }, { count: pageViews }, { count: aiReplies }, { count: incidents },
      { count: leadsThisWeek }, { count: leadsLastWeek },
      { count: msgsThisWeek },  { count: msgsLastWeek },
      { data: recentLeads }, { data: recentMessages }, { data: recentIncidents },
      { data: chartLeads },
      { data: facturasData },
    ] = await Promise.all([
      supabase.from('leads').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
      supabase.from('budget_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('conversations').select('*', { count: 'exact', head: true }),
      supabase.from('page_views').select('*', { count: 'exact', head: true }),
      supabase.from('ai_replies').select('*', { count: 'exact', head: true }),
      supabase.from('incidents').select('*', { count: 'exact', head: true }).eq('status', 'open'),
      supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
      supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', twoWeeksAgo).lt('created_at', weekAgo),
      supabase.from('messages').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
      supabase.from('messages').select('*', { count: 'exact', head: true }).gte('created_at', twoWeeksAgo).lt('created_at', weekAgo),
      supabase.from('leads').select('id, name, email, created_at').order('created_at', { ascending: false }).limit(4),
      supabase.from('messages').select('id, name, body, created_at').order('created_at', { ascending: false }).limit(4),
      supabase.from('incidents').select('id, client_name, description, created_at').order('created_at', { ascending: false }).limit(3),
      supabase.from('leads').select('created_at').gte('created_at', twoWeeksAgo),
      supabase.from('facturas').select('pagos'),
    ])

    const cobrosPendientes = (facturasData || []).reduce((s: number, f: FacturaRow) =>
      s + (f.pagos || []).filter((p) => !p.pagado).length, 0)
    const cobrosVencidos = (facturasData || []).reduce((s: number, f: FacturaRow) =>
      s + (f.pagos || []).filter((p) => !p.pagado && p.fecha < hoy).length, 0)

    setStats({
      leads: leads || 0, unreadMessages: unreadMessages || 0, pendingBudgets: pendingBudgets || 0,
      conversations: conversations || 0, pageViews: pageViews || 0, aiReplies: aiReplies || 0,
      incidents: incidents || 0, cobrosPendientes, cobrosVencidos,
    })

    setTrends({
      leads:    { value: (leadsThisWeek || 0) - (leadsLastWeek || 0), positive: (leadsThisWeek || 0) >= (leadsLastWeek || 0) },
      messages: { value: (msgsThisWeek  || 0) - (msgsLastWeek  || 0), positive: (msgsThisWeek  || 0) >= (msgsLastWeek  || 0) },
    })

    const merged: ActivityItem[] = [
      ...(recentLeads     || []).map((l: LeadRow)     => ({ id: l.id, type: 'lead'     as const, name: l.name,        detail: l.email,                          time: l.created_at })),
      ...(recentMessages  || []).map((m: MessageRow)  => ({ id: m.id, type: 'message'  as const, name: m.name,        detail: m.body?.slice(0, 60) || '',        time: m.created_at })),
      ...(recentIncidents || []).map((i: IncidentRow) => ({ id: i.id, type: 'incident' as const, name: i.client_name, detail: i.description?.slice(0, 60) || '', time: i.created_at })),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8)
    setActivity(merged)

    const dayMap: Record<string, number> = {}
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000)
      dayMap[d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })] = 0
    }
    ;(chartLeads || []).forEach((l: { created_at: string }) => {
      const key = new Date(l.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
      if (key in dayMap) dayMap[key]++
    })
    setChartData(Object.entries(dayMap).map(([day, count]) => ({ day, count })))
  }

  const allClear = stats.unreadMessages === 0 && stats.incidents === 0 && stats.pendingBudgets === 0

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between bg-white dark:bg-slate-900">
        <h1 className="text-lg font-bold text-emerald-500">Mindbridge IA — Admin</h1>
        <button
          onClick={async () => { await supabase.auth.signOut(); router.push('/admin/login') }}
          className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          Cerrar sesión
        </button>
      </header>

      <div className="p-6 max-w-6xl mx-auto space-y-8">

        {allClear && (
          <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl px-5 py-4">
            <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">Todo al día</p>
              <p className="text-xs text-emerald-600/70 dark:text-emerald-300/60">Sin mensajes sin leer, presupuestos pendientes ni incidencias abiertas.</p>
            </div>
          </div>
        )}

        <div>
          <p className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-3 px-1">Resumen</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Leads totales"           value={stats.leads}            color="emerald" trend={trends.leads} />
            <StatCard label="Mensajes sin leer"        value={stats.unreadMessages}   color="yellow"  trend={trends.messages} />
            <StatCard label="Presupuestos pendientes"  value={stats.pendingBudgets}   color="blue" />
            <StatCard label="Conversaciones"           value={stats.conversations}    color="purple" />
            <StatCard label="Visitas web"              value={stats.pageViews}        color="pink" />
            <StatCard label="Respuestas IA"            value={stats.aiReplies}        color="indigo" />
            <StatCard label="Incidencias abiertas"     value={stats.incidents}        color="red" />
            <StatCard label="Cobros vencidos"          value={stats.cobrosVencidos}   color="red" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">Leads — últimos 14 días</p>
            <MiniChart data={chartData} />
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">Actividad reciente</p>
            {activity.length === 0
              ? <p className="text-sm text-slate-400">Sin actividad todavía.</p>
              : <div className="space-y-3">{activity.map(item => <ActivityRow key={item.id + item.type} item={item} />)}</div>
            }
          </div>
        </div>

        <div>
          <p className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-3 px-1">Acciones rápidas</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/facturas" className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-emerald-500/20">
              + Nueva factura
            </Link>
            <Link href="/admin/budgets" className="px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors">
              + Nuevo presupuesto
            </Link>
          </div>
        </div>

        <div className="space-y-5">
          <NavGroup title="Clientes">
            <NavCard href="/admin/contacts" title="Contactos" description="Leads y mensajes del formulario web" badge={stats.leads + stats.unreadMessages} badgeColor="emerald" />
          </NavGroup>
          <NavGroup title="Negocio">
            <NavCard href="/admin/budgets"  title="Presupuestos" description="Solicitudes y propuestas generadas" badge={stats.pendingBudgets} badgeColor="blue" />
            <NavCard href="/admin/facturas" title="Facturas"     description="Crear y gestionar facturas con fraccionamiento" />
            <NavCard href="/admin/cobros"   title="Cobros"
              description={stats.cobrosVencidos > 0 ? `⚠ ${stats.cobrosVencidos} vencido${stats.cobrosVencidos > 1 ? 's' : ''} · ${stats.cobrosPendientes} pendientes` : 'Plazos pendientes y registro de pagos'}
              badge={stats.cobrosPendientes} badgeColor="red"
            />
            <NavCard href="/admin/clientes" title="Clientes"     description="Lista de clientes generada desde facturas" />
            <NavCard href="/admin/contrato" title="Contratos"    description="Plantilla de contrato de servicios · genera PDF" />
          </NavGroup>
          <NavGroup title="Soporte">
            <NavCard href="/admin/incidents"     title="Incidencias"    description="Soporte técnico de clientes"     badge={stats.incidents}     badgeColor="red" />
            <NavCard href="/admin/conversations" title="Conversaciones" description="Chats del asistente IA"          badge={stats.conversations} badgeColor="purple" />
          </NavGroup>
          <NavGroup title="Sistema">
            <NavCard href="/admin/ai-replies" title="Respuestas IA" description="Emails generados automáticamente por IA" badge={stats.aiReplies} badgeColor="indigo" />
          </NavGroup>
        </div>

      </div>
    </div>
  )
}
