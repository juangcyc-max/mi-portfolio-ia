'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabaseAdmin'
import { LayoutDashboard, FileText, AlertTriangle, Receipt, CreditCard } from 'lucide-react'
import type { Session } from '@supabase/supabase-js'

const NAV_ITEMS = [
  { href: '/admin',           label: 'Inicio',        Icon: LayoutDashboard },
  { href: '/admin/budgets',   label: 'Presupuestos',  Icon: FileText },
  { href: '/admin/incidents', label: 'Incidencias',   Icon: AlertTriangle },
  { href: '/admin/facturas',  label: 'Facturas',      Icon: Receipt },
  { href: '/admin/cobros',    label: 'Cobros',        Icon: CreditCard },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseClient()
    supabase.auth.getSession().then((result: { data: { session: Session | null } }) => {
      if (!result.data.session && pathname !== '/admin/login') {
        router.replace('/admin/login')
      }
      setChecking(false)
    })
  }, [pathname, router])

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Verificando sesión...</p>
      </div>
    )
  }

  if (pathname === '/admin/login') return <>{children}</>

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <div>
      {/* Top bar — sticky */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-400 sticky top-0 z-30">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          ← Web
        </Link>
        <Link href="/admin" className="hover:text-emerald-600 transition-colors font-medium">
          Panel Admin · Mindbridge IA
        </Link>
      </div>

      {/* Page content — extra bottom padding on mobile for nav */}
      <div className="pb-20 md:pb-0">
        {children}
      </div>

      {/* Mobile bottom nav — hidden on md+ */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-slate-200 safe-area-bottom">
        <div className="flex">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors ${
                  active ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[9px] font-semibold leading-none">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
