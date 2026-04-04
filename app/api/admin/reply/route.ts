import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function POST(request: Request) {
  try {
    const { to, name, subject, body } = await request.json()
    if (!to || !name || !body) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }
    if (!to.includes('@')) {
      return NextResponse.json({ error: 'Email del destinatario no válido. El cliente no ha proporcionado su email todavía.' }, { status: 400 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const logoUrl = `${SITE_URL}/logo.svg`

    const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:system-ui,sans-serif;background-color:#f8fafc;color:#0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
          <tr>
            <td style="background-color:#ffffff;padding:28px 24px;text-align:center;border-bottom:2px solid #e2e8f0;">
              <img src="${logoUrl}" alt="Mindbridge IA" width="160" style="display:block;margin:0 auto;max-width:160px;height:auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding:32px 24px;">
              <p style="margin:0 0 16px 0;font-size:15px;color:#0f172a;">Hola ${name},</p>
              <div style="font-size:15px;color:#334155;line-height:1.7;white-space:pre-wrap;">${body.replace(/\n/g, '<br/>')}</div>
              <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e2e8f0;">
                <p style="margin:0;font-size:14px;color:#0f172a;font-weight:600;">Juan</p>
                <p style="margin:4px 0 0 0;font-size:13px;color:#64748b;">Mindbridge IA — Desarrollo Web + Inteligencia Artificial</p>
                <a href="${SITE_URL}" style="font-size:13px;color:#10b981;text-decoration:none;">${SITE_URL.replace('https://', '')}</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:11px;color:#94a3b8;">Mindbridge IA · Cantabria, España</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

    const { error } = await resend.emails.send({
      from: 'Juan · Mindbridge IA <hola@mindbride.net>',
      to: [to],
      subject: subject || `Re: Tu consulta en Mindbridge IA`,
      html,
      text: `Hola ${name},\n\n${body}\n\nJuan\nMindbridge IA\n${SITE_URL}`,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Error al enviar el email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Reply error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
