import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const facturaId = formData.get('factura_id') as string
    const plazoIdx = parseInt(formData.get('plazo_idx') as string)
    const plazoImporte = parseFloat(formData.get('plazo_importe') as string)

    if (!file || !facturaId) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Subir archivo a Supabase Storage
    const buffer = await file.arrayBuffer()
    const ext = file.name.split('.').pop() || 'pdf'
    const path = `${facturaId}/plazo-${plazoIdx}-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('justificantes')
      .upload(path, buffer, { contentType: file.type, upsert: false })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // URL firmada válida 1 hora
    const { data: signedData } = await supabase.storage
      .from('justificantes')
      .createSignedUrl(path, 3600)

    const signedUrl = signedData?.signedUrl ?? null

    // Analizar con Claude
    const base64 = Buffer.from(buffer).toString('base64')
    const isImage = file.type.startsWith('image/')

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

    const content: any[] = [
      isImage
        ? { type: 'image', source: { type: 'base64', media_type: file.type, data: base64 } }
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

    let extracted: any = null
    try {
      const raw = response.content[0].type === 'text' ? response.content[0].text : ''
      extracted = JSON.parse(raw.trim())
    } catch {
      extracted = null
    }

    const coincide = extracted?.importe != null
      && Math.abs(Number(extracted.importe) - plazoImporte) < 1

    // Guardar la ruta del archivo en el campo justificante_path de la factura
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
  } catch (err: any) {
    console.error('[analizar-justificante]', err)
    return NextResponse.json({ error: err.message ?? 'Error interno' }, { status: 500 })
  }
}
