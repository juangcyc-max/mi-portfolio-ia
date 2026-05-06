import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { notifyJuan } from '@/lib/whatsapp'

async function sendPush(title: string, body: string) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data: tokens } = await supabase.from('push_tokens').select('token')
    if (!tokens || tokens.length === 0) return
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tokens.map((t: { token: string }) => ({
        to: t.token, title, body, sound: 'default',
      }))),
    })
  } catch (err) {
    console.error('[push] budget-request:', err)
  }
}

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { name, email, project_type, budget_range, additional_info } = await req.json()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!name || !email) {
    return NextResponse.json({ error: 'Nombre y email obligatorios' }, { status: 400 })
  }
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
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

  sendPush(
    `💰 Nuevo presupuesto de ${name}`,
    `${project_type || 'Proyecto'} · ${budget_range || 'Sin rango'}`
  )

  return NextResponse.json({ ok: true })
}
