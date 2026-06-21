import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAdminUser, unauthorized } from '@/lib/adminAuth'

export async function DELETE(req: NextRequest) {
  if (!(await getAdminUser())) return unauthorized()

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  await supabase.from('chat_messages').delete().eq('conversation_id', id)
  const { error } = await supabase.from('conversations').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
