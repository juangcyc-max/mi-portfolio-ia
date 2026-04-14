'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabaseAdmin'

const supabase = getSupabaseClient()

type Stats = {
  leads: number; unreadMessages: number; pendingBudgets: number
  conversations: number; pageViews: number; aiReplies: number; incidents: number
}
type Trend = { value: number; positive: boolean }
type ActivityItem = {
  id: string; type: 'lead' | 'message' | 'incident'
  name: string; detail: string; time: string
}

// ── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, value, color, trend }: { label: string; value: number; color: string; trend?: Trend }) {
  const colors: Record<string, string> = {
    emerald: 'text-emerald-500', yellow: 'text-yellow-400', blue: 'text-blue-400',
    purple: 'text-purple-400', pink: 'text-pink-400', indigo: 'text-indigo-400', red: 'text-red-400',
  }
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${colors[color]}`}>{value}</p>
      {trend && trend.value !== 0 && (
        <p className={`text-xs mt-1.5 font-semibold ${trend.positive ? 'text-emerald-500' : 'text-red-400'}`}>
          {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)} esta semana
        </p>
      )}
      {trend && trend.value === 0 && (
        <p className="text-xs mt-1.5 text-slate-300 dark:text-slate-600">— sin cambios</p>
      )}
    </div>
  )
}

function NavGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-2 px-1">{title}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
    </div>
  )
}

function NavCard({ href, title, description, badge, badgeColor }: {
  href: string; title: string; description: string; badge?: number; badgeColor?: string
}) {
  const badgeColors: Record<string, string> = {
    emerald: 'bg-emerald-500', yellow: 'bg-yellow-400 text-slate-900',
    blue: 'bg-blue-500', purple: 'bg-purple-500',
    indigo: 'bg-indigo-500', red: 'bg-red-500',
  }
  return (
    <Link href={href} className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors block group">
      {badge !== undefined && badge > 0 && (
        <span className={`absolute top-3 right-3 min-w-[22px] h-[22px] px-1.5 rounded-full ${badgeColors[badgeColor || 'slate']} text-white text-[10px] font-black flex items-center justify-center`}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
    </Link>
  )
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const cfg = {
    lead:     { label: 'Lead',      dot: 'bg-emerald-500' },
    message:  { label: 'Mensaje',   dot: 'bg-blue-500' },
    incident: { label: 'Incidencia', dot: 'bg-red-500' },
  }[item.type]

  const relativeTime = (d: string) => {
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
    if (mins < 60) return `${mins}m`
    if (mins < 1440) return `${Math.floor(mins / 60)}h`
    return `${Math.floor(mins / 1440)}d`
  }

  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{item.name}</p>
        <p className="text-xs text-slate-400 truncate">{item.detail}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[10px] text-slate-400">{relativeTime(item.time)}</p>
        <p className="text-[10px] text-slate-300 dark:text-slate-600">{cfg.label}</p>
      </div>
    </div>
  )
}

function MiniChart({ data }: { data: { day: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
          <div
            className="w-full bg-emerald-500/30 dark:bg-emerald-500/40 hover:bg-emerald-500/60 rounded-sm transition-colors"
            style={{ height: `${Math.max((d.count / max) * 100, 6)}%` }}
            title={`${d.day}: ${d.count} leads`}
          />
          {(i === 0 || i === data.length - 1 || i === 6) && (
            <span className="text-[8px] text-slate-400 whitespace-nowrap">{d.day}</span>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Main page ───────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    leads: 0, unreadMessages: 0, pendingBudgets: 0,
    conversations: 0, pageViews: 0, aiReplies: 0, incidents: 0,
  })
  const [trends, setTrends] = useState<{ leads: Trend; messages: Trend }>({
    leads: { value: 0, positive: true },
    messages: { value: 0, positive: true },
  })
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [chartData, setChartData] = useState<{ day: string; count: number }[]>([])

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString()

    const [
      { count: leads }, { count: unreadMessages }, { count: pendingBudgets },
      { count: conversations }, { count: pageViews }, { count: aiReplies }, { count: incidents },
      { count: leadsThisWeek }, { count: leadsLastWeek },
      { count: msgsThisWeek }, { count: msgsLastWeek },
      { data: recentLeads }, { data: recentMessages }, { data: recentIncidents },
      { data: chartLeads },
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
      supabase.from('messages').select('id, name, message, created_at').order('created_at', { ascending: false }).limit(4),
      supabase.from('incidents').select('id, client_name, description, created_at').order('created_at', { ascending: false }).limit(3),
      supabase.from('leads').select('created_at').gte('created_at', twoWeeksAgo),
    ])

    setStats({
      leads: leads || 0, unreadMessages: unreadMessages || 0, pendingBudgets: pendingBudgets || 0,
      conversations: conversations || 0, pageViews: pageViews || 0, aiReplies: aiReplies || 0, incidents: incidents || 0,
    })

    const lThis = leadsThisWeek || 0, lLast = leadsLastWeek || 0
    const mThis = msgsThisWeek || 0, mLast = msgsLastWeek || 0
    setTrends({
      leads: { value: lThis - lLast, positive: lThis >= lLast },
      messages: { value: mThis - mLast, positive: mThis >= mLast },
    })

    const merged: ActivityItem[] = [
      ...(recentLeads || []).map((l: any) => ({ id: l.id, type: 'lead' as const, name: l.name, detail: l.email, time: l.created_at })),
      ...(recentMessages || []).map((m: any) => ({ id: m.id, type: 'message' as const, name: m.name, detail: m.message?.slice(0, 60) || '', time: m.created_at })),
      ...(recentIncidents || []).map((i: any) => ({ id: i.id, type: 'incident' as const, name: i.client_name, detail: i.description?.slice(0, 60) || '', time: i.created_at })),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8)
    setActivity(merged)

    // Chart: last 14 days
    const dayMap: Record<string, number> = {}
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      dayMap[d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })] = 0
    }
    ;(chartLeads || []).forEach((l: any) => {
      const key = new Date(l.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
      if (key in dayMap) dayMap[key]++
    })
    setChartData(Object.entries(dayMap).map(([day, count]) => ({ day, count })))
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const allClear = stats.unreadMessages === 0 && stats.incidents === 0 && stats.pendingBudgets === 0

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between bg-white dark:bg-slate-900">
        <h1 className="text-lg font-bold text-emerald-500">Mindbridge IA — Admin</h1>
        <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          Cerrar sesión
        </button>
      </header>

      <div className="p-6 max-w-6xl mx-auto space-y-8">

        {/* Estado limpio */}
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

        {/* Stats */}
        <div>
          <p className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-3 px-1">Resumen</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Leads totales"        value={stats.leads}          color="emerald" trend={trends.leads} />
            <StatCard label="Mensajes sin leer"    value={stats.unreadMessages} color="yellow"  trend={trends.messages} />
            <StatCard label="Presupuestos pendientes" value={stats.pendingBudgets} color="blue" />
            <StatCard label="Conversaciones"       value={stats.conversations}  color="purple" />
            <StatCard label="Visitas web"          value={stats.pageViews}      color="pink" />
            <StatCard label="Respuestas IA"        value={stats.aiReplies}      color="indigo" />
            <StatCard label="Incidencias abiertas" value={stats.incidents}      color="red" />
          </div>
        </div>

        {/* Chart + Feed */}
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

        {/* Acciones rápidas */}
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

        {/* Nav agrupada */}
        <div className="space-y-5">
          <NavGroup title="Clientes">
            <NavCard href="/admin/leads"    title="Leads"    description="Ver todos los contactos recibidos"      badge={stats.leads}          badgeColor="emerald" />
            <NavCard href="/admin/messages" title="Mensajes" description="Bandeja de mensajes del formulario"     badge={stats.unreadMessages} badgeColor="yellow" />
          </NavGroup>
          <NavGroup title="Negocio">
            <NavCard href="/admin/budgets"  title="Presupuestos" description="Solicitudes y propuestas generadas"               badge={stats.pendingBudgets} badgeColor="blue" />
            <NavCard href="/admin/facturas" title="Facturas"     description="Crear y gestionar facturas con fraccionamiento" />
            <NavCard href="/admin/clientes" title="Clientes"     description="Lista de clientes generada desde facturas" />
          </NavGroup>
          <NavGroup title="Soporte">
            <NavCard href="/admin/incidents"     title="Incidencias"   description="Soporte técnico de clientes"       badge={stats.incidents}     badgeColor="red" />
            <NavCard href="/admin/conversations" title="Conversaciones" description="Chats del asistente IA"           badge={stats.conversations} badgeColor="purple" />
          </NavGroup>
          <NavGroup title="Sistema">
            <NavCard href="/admin/ai-replies" title="Respuestas IA" description="Emails generados automáticamente por IA" badge={stats.aiReplies} badgeColor="indigo" />
          </NavGroup>
        </div>

      </div>
    </div>
  )
}
