'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    leads: 0,
    unreadMessages: 0,
    pendingBudgets: 0,
  })

  useEffect(() => {
    async function loadStats() {
      const [{ count: leads }, { count: unreadMessages }, { count: pendingBudgets }] =
        await Promise.all([
          supabase.from('leads').select('*', { count: 'exact', head: true }),
          supabase.from('messages').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
          supabase.from('budget_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        ])
      setStats({
        leads: leads || 0,
        unreadMessages: unreadMessages || 0,
        pendingBudgets: pendingBudgets || 0,
      })
    }
    loadStats()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-emerald-400">Mindbridge IA — Admin</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Cerrar sesión
        </button>
      </header>

      <div className="p-6 max-w-5xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard label="Leads totales" value={stats.leads} color="emerald" />
          <StatCard label="Mensajes sin leer" value={stats.unreadMessages} color="yellow" />
          <StatCard label="Presupuestos pendientes" value={stats.pendingBudgets} color="blue" />
        </div>

        {/* Nav */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NavCard href="/admin/leads" title="Leads" description="Ver todos los contactos recibidos" />
          <NavCard href="/admin/messages" title="Mensajes" description="Bandeja de mensajes del formulario" />
          <NavCard href="/admin/budgets" title="Presupuestos" description="Solicitudes y propuestas generadas" />
          <NavCard href="/admin/conversations" title="Conversaciones" description="Chats del asistente IA" />
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
  }
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${colors[color]}`}>{value}</p>
    </div>
  )
}

function NavCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-emerald-500 transition-colors block"
    >
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </Link>
  )
}
