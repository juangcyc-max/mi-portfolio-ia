import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { incidentId, name, email } = await request.json()
    if (!incidentId || !email) {
      return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Update incident with real client data
    await supabase
      .from('incidents')
      .update({ client_name: name || 'Visitante', client_email: email })
      .eq('id', incidentId)

    // Confirmation email to client
    await resend.emails.send({
      from: 'Soporte · Mindbridge IA <hola@mindbride.net>',
      to: [email],
      subject: 'Incidencia recibida — Estamos en ello',
      html: `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:system-ui,sans-serif;background:#f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
        <tr><td style="background:#0f172a;padding:24px;text-align:center;">
          <span style="color:#10b981;font-size:20px;font-weight:700;">Mindbridge IA</span>
        </td></tr>
        <tr><td style="padding:32px 24px;">
          <h2 style="color:#0f172a;margin:0 0 16px;">Hemos recibido tu incidencia</h2>
          <p style="color:#475569;line-height:1.8;margin:0 0 16px;">
            Hola ${name || 'visitante'},<br/><br/>
            Hemos registrado tu consulta y Juan la revisará lo antes posible. Recibirás una respuesta en tu email en menos de 24 horas.
          </p>
          <p style="color:#475569;line-height:1.8;margin:0;">
            Si tu incidencia es urgente, puedes escribirnos directamente a
            <a href="mailto:juangutierrezdelaconcha@mindbride.net" style="color:#10b981;">juangutierrezdelaconcha@mindbride.net</a>
          </p>
        </td></tr>
        <tr><td style="background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:11px;color:#94a3b8;">Mindbridge IA · Soporte técnico · <a href="https://mindbride.net" style="color:#10b981;text-decoration:none;">mindbride.net</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('incident-email error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
