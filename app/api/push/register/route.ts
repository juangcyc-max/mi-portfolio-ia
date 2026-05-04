import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()
    if (!token || !String(token).startsWith('ExponentPushToken')) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await supabase
      .from('push_tokens')
      .upsert({ token }, { onConflict: 'token' })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[push/register]', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
