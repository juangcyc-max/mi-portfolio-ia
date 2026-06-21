import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { getAdminUser, unauthorized } from '@/lib/adminAuth'

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
])

export async function POST(req: NextRequest) {
  if (!(await getAdminUser())) return unauthorized()

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const facturaId = formData.get('factura_id') as string
    const plazoIdx = parseInt(formData.get('plazo_idx') as string)
    const plazoImporte = parseFloat(formData.get('plazo_importe') as string)

    if (!file || !facturaId) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Archivo demasiado grande (máx 10 MB)' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const buffer = await file.arrayBuffer()
    const ext = file.type === 'application/pdf' ? 'pdf' : file.type.split('/')[1]
    const path = `${facturaId}/plazo-${plazoIdx}-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('justificantes')
      .upload(path, buffer, { contentType: file.type, upsert: false })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: signedData } = await supabase.storage
      .from('justificantes')
      .createSignedUrl(path, 3600)

    const signedUrl = signedData?.signedUrl ?? null

    const base64 = Buffer.from(buffer).toString('base64')
    const isImage = file.type.startsWith('image/')

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

    const content: Anthropic.MessageParam['content'] = [
      isImage
        ? { type: 'image', source: { type: 'base64', media_type: file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp', data: base64 } }
        : { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } },
      {
        type: 'text',
        text: `Analiza este justificante de pago bancario. Extrae SOLO este JSON sin texto adicional:
{"importe": número, "fecha": "YYYY-MM-DD", "remitente": "nombre", "concepto": "texto"}
Si no encuentras un dato ponlo null. Solo responde el JSON.`,
      },
    ]

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{ role: 'user', content }],
    })

    let extracted: { importe?: number; fecha?: string; remitente?: string; concepto?: string } | null = null
    try {
      const raw = response.content[0].type === 'text' ? response.content[0].text : ''
      extracted = JSON.parse(raw.trim())
    } catch {
      extracted = null
    }

    const coincide = extracted?.importe != null
      && Math.abs(Number(extracted.importe) - plazoImporte) < 1

    const { data: facturaData } = await supabase
      .from('facturas')
      .select('pagos')
      .eq('id', facturaId)
      .single()

    if (facturaData) {
      const pagos = [...facturaData.pagos]
      if (pagos[plazoIdx]) {
        pagos[plazoIdx] = { ...pagos[plazoIdx], justificante_path: path }
        await supabase.from('facturas').update({ pagos }).eq('id', facturaId)
      }
    }

    return NextResponse.json({ ok: true, signedUrl, extracted, coincide, path })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    console.error('[analizar-justificante]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
