import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ADMIN_EMAIL } from '@/lib/config'

export async function getAdminUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  // Autenticado Y autorizado: solo el email admin pasa
  if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) return null
  return user
}

export const unauthorized = () =>
  NextResponse.json({ error: 'No autorizado' }, { status: 401 })
