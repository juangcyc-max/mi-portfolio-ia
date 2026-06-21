import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const OWNER_KEY = 'MB-OWNER-2026'

const cors = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors })

  const { key } = await req.json()

  if (key === OWNER_KEY) {
    return new Response(JSON.stringify({ valid: true, plan: 'owner' }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const { data, error } = await supabase
    .from('licenses')
    .select('plan, active, expires_at, email')
    .eq('key', key)
    .single()

  if (error || !data || !data.active) {
    return new Response(JSON.stringify({ valid: false, error: 'Licencia no encontrada' }), {
      status: 403,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return new Response(JSON.stringify({ valid: false, error: 'Licencia expirada' }), {
      status: 403,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ valid: true, plan: data.plan, email: data.email }), {
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
})
