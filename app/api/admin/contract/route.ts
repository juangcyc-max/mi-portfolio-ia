import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAdminUser, unauthorized } from '@/lib/adminAuth'
import { DEFAULT_CONTRACT_TEMPLATE } from '@/lib/contractTemplate'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  if (!(await getAdminUser())) return unauthorized()

  const supabase = adminClient()
  const { data } = await supabase
    .from('contract_template')
    .select('content, updated_at')
    .eq('id', 1)
    .maybeSingle()

  return NextResponse.json({
    content: data?.content ?? DEFAULT_CONTRACT_TEMPLATE,
    updatedAt: data?.updated_at ?? null,
  })
}

export async function PUT(request: Request) {
  if (!(await getAdminUser())) return unauthorized()

  const { content } = await request.json()
  if (typeof content !== 'string' || !content.trim()) {
    return NextResponse.json({ error: 'El contenido no puede estar vacío' }, { status: 400 })
  }
  if (content.length > 50_000) {
    return NextResponse.json({ error: 'Contenido demasiado largo' }, { status: 400 })
  }

  const supabase = adminClient()
  const { error } = await supabase
    .from('contract_template')
    .upsert({ id: 1, content, updated_at: new Date().toISOString() })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
