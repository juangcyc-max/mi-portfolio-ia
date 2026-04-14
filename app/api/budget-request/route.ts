import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { notifyJuan } from '@/lib/whatsapp'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { name, email, project_type, budget_range, additional_info } = await req.json()

  if (!name || !email) {
    return NextResponse.json({ error: 'Nombre y email obligatorios' }, { status: 400 })
  }

  const { error } = await supabase.from('budget_requests').insert({
    name,
    email,
    project_type,
    budget_range,
    additional_info,
    status: 'pending',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  notifyJuan(
    `💰 Nueva solicitud de presupuesto\n👤 ${name}\n📧 ${email}\n🏷️ ${project_type || '—'} · ${budget_range || '—'}\n\n${additional_info ? additional_info.slice(0, 150) : 'Sin comentarios adicionales'}\n\nRevisa: mindbride.net/admin/budgets`
  ).catch(() => {})

  return NextResponse.json({ ok: true })
}
