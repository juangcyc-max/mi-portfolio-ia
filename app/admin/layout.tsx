'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabaseAdmin'
import type { Session } from '@supabase/supabase-js'

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

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div>
      {/* Barra superior con home */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
        <Link href="/" className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
          ← Volver a la web
        </Link>
        <Link href="/admin" className="hover:text-emerald-600 transition-colors font-medium">
          Panel Admin · Mindbridge IA
        </Link>
      </div>
      {children}
    </div>
  )
}
