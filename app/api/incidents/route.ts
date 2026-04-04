import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function POST(request: Request) {
  try {
    const { name, email, service, description, priority } = await request.json()
    if (!name || !email || !description) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const resend = new Resend(process.env.RESEND_API_KEY)
    const logoUrl = `${SITE_URL}/logo.svg`

    // Triage IA: clasificar y responder si es sencillo
    let aiResponse = ''
    let resolvedByAI = false

    try {
      const aiCall = generateText({
        model: anthropic('claude-haiku-4-5-20251001'),
        system: `Eres el sistema de soporte técnico de Mindbridge IA.
Analiza incidencias de clientes y determina si puedes resolverlas automáticamente.

PUEDES RESOLVER AUTOMÁTICAMENTE:
- Dudas sobre cómo usar el panel admin
- Preguntas sobre funcionalidades existentes
- Problemas de acceso o contraseña (indicar cómo resetear)
- Preguntas sobre facturación o planes
- Problemas de caché o visualización (indicar limpiar caché)
- Dudas sobre el chatbot IA

DEBES ESCALAR A JUAN (responde ESCALAR):
- Web caída o inaccesible
- Pérdida de datos
- Fallos en integraciones críticas (pagos, CRM)
- Bugs que afectan al negocio del cliente
- Solicitudes de cambios o nuevas funcionalidades

FORMATO DE RESPUESTA:
- Si puedes resolverlo: escribe directamente la respuesta al cliente (máx 3 párrafos, en español, cálida y profesional). NO incluyas "ESCALAR".
- Si debes escalar: responde exactamente "ESCALAR" y nada más.`,
        prompt: `Cliente: ${name} (${email})
Servicio afectado: ${service || 'No especificado'}
Urgencia: ${priority}
Problema: ${description}`,
      })
      const timeout = new Promise<{ text: string }>((_, reject) =>
        setTimeout(() => reject(new Error('AI timeout')), 7000)
      )
      const { text } = await Promise.race([aiCall, timeout])

      if (text.trim() === 'ESCALAR') {
        resolvedByAI = false
        aiResponse = ''
      } else {
        resolvedByAI = true
        aiResponse = text
      }
    } catch (aiError) {
      console.error('Error IA triage:', aiError)
    }

    // Guardar incidencia en Supabase
    await supabase.from('incidents').insert({
      client_name: name,
      client_email: email,
      service: service || null,
      description,
      priority,
      status: resolvedByAI ? 'ai_handled' : 'open',
      ai_response: aiResponse || null,
    })

    // Email a Juan (siempre)
    const priorityMap: Record<string, string> = { normal: 'Normal', high: 'Alta', urgent: '🚨 URGENTE' }
    const priorityLabel = priorityMap[priority] || priority
    await resend.emails.send({
      from: 'Soporte Mindbridge IA <hola@mindbride.net>',
      to: ['juangutierrezdelaconcha@mindbride.net'],
      subject: `[${priorityLabel}] Incidencia de ${name}${resolvedByAI ? ' — Resuelta por IA' : ' — REQUIERE ATENCIÓN'}`,
      html: `
<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
  <h2 style="color:${resolvedByAI ? '#10b981' : '#ef4444'}">
    ${resolvedByAI ? '✅ Incidencia resuelta por IA' : '⚠️ Incidencia requiere tu atención'}
  </h2>
  <p><strong>Cliente:</strong> ${name} (${email})</p>
  <p><strong>Servicio:</strong> ${service || '—'}</p>
  <p><strong>Urgencia:</strong> ${priorityLabel}</p>
  <p><strong>Problema:</strong></p>
  <blockquote style="border-left:4px solid #e2e8f0;padding-left:16px;color:#475569;">${description}</blockquote>
  ${aiResponse ? `<p><strong>Respuesta enviada por IA:</strong></p><blockquote style="border-left:4px solid #10b981;padding-left:16px;color:#334155;">${aiResponse.replace(/\n/g, '<br/>')}</blockquote>` : ''}
  <a href="${SITE_URL}/admin" style="display:inline-block;margin-top:16px;background:#10b981;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;">Ver en el panel admin</a>
</div>`,
    })

    // Email al cliente
    const clientEmailBody = resolvedByAI
      ? aiResponse
      : `Hola ${name},\n\nHemos recibido tu incidencia y la estamos revisando con prioridad ${priority === 'urgent' ? 'urgente' : 'alta'}. Juan te contactará en breve.\n\nUn saludo,\nEquipo Mindbridge IA`

    const clientEmailHtml = `
<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:system-ui,sans-serif;background:#f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
        <tr><td style="padding:28px 24px;text-align:center;border-bottom:2px solid #e2e8f0;">
          <img src="${logoUrl}" alt="Mindbridge IA" width="160" style="max-width:160px;height:auto;display:block;margin:0 auto;" />
        </td></tr>
        <tr><td style="padding:32px 24px;">
          <div style="font-size:15px;color:#334155;line-height:1.8;white-space:pre-wrap;">${clientEmailBody.replace(/\n/g, '<br/>')}</div>
        </td></tr>
        <tr><td style="background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:11px;color:#94a3b8;">Mindbridge IA · Soporte técnico · <a href="${SITE_URL}" style="color:#10b981;text-decoration:none;">${SITE_URL.replace('https://','')}</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

    await resend.emails.send({
      from: 'Soporte · Mindbridge IA <hola@mindbride.net>',
      to: [email],
      subject: resolvedByAI ? 'Hemos resuelto tu incidencia' : 'Incidencia recibida — Estamos en ello',
      html: clientEmailHtml,
      text: clientEmailBody,
    })

    // Notificación push si no resuelta por IA
    if (!resolvedByAI) {
      try {
        const { data: tokens } = await supabase.from('push_tokens').select('token')
        if (tokens && tokens.length > 0) {
          await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tokens.map((t: { token: string }) => ({
              to: t.token,
              title: `⚠️ Incidencia ${priority === 'urgent' ? 'URGENTE' : 'nueva'} de ${name}`,
              body: description.slice(0, 100),
              sound: 'default',
            }))),
          })
        }
      } catch (pushError) {
        console.error('Push error:', pushError)
      }
    }

    return NextResponse.json({ success: true, resolvedByAI })
  } catch (err) {
    console.error('Incidents error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
