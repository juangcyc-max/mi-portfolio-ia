import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY')!
const OWNER_KEY     = 'MB-OWNER-2026'

const cors = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-license-key',
}

async function isValidLicense(key: string): Promise<boolean> {
  if (key === OWNER_KEY) return true
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )
  const { data } = await supabase
    .from('licenses')
    .select('active, expires_at')
    .eq('key', key)
    .single()
  if (!data || !data.active) return false
  if (data.expires_at && new Date(data.expires_at) < new Date()) return false
  return true
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors })

  const licenseKey = req.headers.get('x-license-key') ?? ''
  if (!await isValidLicense(licenseKey)) {
    return new Response(JSON.stringify({ error: 'Licencia inválida o expirada' }), {
      status: 403,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }

  const body = await req.json()

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key':          ANTHROPIC_KEY,
      'anthropic-version':  '2023-06-01',
      'content-type':       'application/json',
    },
    body: JSON.stringify(body),
  })

  // Pass through streaming or regular response
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      ...cors,
      'Content-Type':      upstream.headers.get('Content-Type') ?? 'application/json',
      'Transfer-Encoding': 'chunked',
    },
  })
})
