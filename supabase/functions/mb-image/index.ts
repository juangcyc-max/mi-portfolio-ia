import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const OPENAI_KEY = Deno.env.get('OPENAI_API_KEY')!
const OWNER_KEY  = 'MB-OWNER-2026'

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

  const { prompt, size, quality } = await req.json()

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      model:           'dall-e-3',
      prompt,
      n:               1,
      size:            size    ?? '1024x1024',
      quality:         quality ?? 'standard',
      response_format: 'url',
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    const msg = typeof data.error === 'string' ? data.error : (data.error?.message ?? 'Error OpenAI')
    return new Response(JSON.stringify({ error: msg }), {
      status: res.status,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
})
