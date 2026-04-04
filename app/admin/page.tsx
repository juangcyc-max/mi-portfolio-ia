'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabaseAdmin'

const supabase = getSupabaseClient()

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    leads: 0,
    unreadMessages: 0,
    pendingBudgets: 0,
    conversations: 0,
    pageViews: 0,
    aiReplies: 0,
    incidents: 0,
  })

  useEffect(() => {
    async function loadStats() {
      const [{ count: leads }, { count: unreadMessages }, { count: pendingBudgets }, { count: conversations }, { count: pageViews }, { count: aiReplies }, { count: incidents }] =
        await Promise.all([
          supabase.from('leads').select('*', { count: 'exact', head: true }),
          supabase.from('messages').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
          supabase.from('budget_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('conversations').select('*', { count: 'exact', head: true }),
          supabase.from('page_views').select('*', { count: 'exact', head: true }),
          supabase.from('ai_replies').select('*', { count: 'exact', head: true }),
          supabase.from('incidents').select('*', { count: 'exact', head: true }).eq('status', 'open'),
        ])
      setStats({
        leads: leads || 0,
        unreadMessages: unreadMessages || 0,
        pendingBudgets: pendingBudgets || 0,
        conversations: conversations || 0,
        pageViews: pageViews || 0,
        aiReplies: aiReplies || 0,
        incidents: incidents || 0,
      })
    }
    loadStats()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-emerald-400">Mindbridge IA — Admin</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          Cerrar sesión
        </button>
      </header>

      <div className="p-6 max-w-5xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Leads" value={stats.leads} color="emerald" />
          <StatCard label="Sin leer" value={stats.unreadMessages} color="yellow" />
          <StatCard label="Presupuestos" value={stats.pendingBudgets} color="blue" />
          <StatCard label="Conversaciones" value={stats.conversations} color="purple" />
          <StatCard label="Visitas web" value={stats.pageViews} color="pink" />
          <StatCard label="Resp. IA" value={stats.aiReplies} color="indigo" />
          <StatCard label="Incidencias abiertas" value={stats.incidents} color="red" />
        </div>

        {/* Nav */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NavCard href="/admin/leads" title="Leads" description="Ver todos los contactos recibidos" />
          <NavCard href="/admin/messages" title="Mensajes" description="Bandeja de mensajes del formulario" />
          <NavCard href="/admin/budgets" title="Presupuestos" description="Solicitudes y propuestas generadas" />
          <NavCard href="/admin/conversations" title="Conversaciones" description="Chats del asistente IA" />
          <NavCard href="/admin/ai-replies" title="Respuestas IA" description="Emails generados automáticamente por IA" />
          <NavCard href="/admin/incidents" title="Incidencias" description="Soporte técnico de clientes" />
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    emerald: 'text-emerald-400',
    yellow: 'text-yellow-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    pink: 'text-pink-400',
    indigo: 'text-indigo-400',
    red: 'text-red-400',
  }
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${colors[color]}`}>{value}</p>
    </div>
  )
}

function NavCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="bg-white border border-slate-200 rounded-xl p-5 hover:border-emerald-500 transition-colors block"
    >
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
    </Link>
  )
}
