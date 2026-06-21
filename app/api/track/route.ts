import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(ip, 60, 60_000)) {
    return NextResponse.json({ ok: true })
  }

  try {
    const { path, userAgent } = await request.json()
    if (!path || typeof path !== 'string' || path.length > 500) return NextResponse.json({ ok: true })

    // Service role key bypasses RLS — el tracker no necesita autenticación
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await supabase.from('page_views').insert({ path, user_agent: userAgent ?? '' })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
