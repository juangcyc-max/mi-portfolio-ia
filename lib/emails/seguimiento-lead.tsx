export function seguimientoLeadHtml({ name }: { name: string }) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:system-ui,sans-serif;background:#f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);">

        <tr>
          <td style="background:linear-gradient(135deg,#10b981,#0ea5e9);padding:32px 24px;text-align:center;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">Mindbridge IA</p>
          </td>
        </tr>

        <tr>
          <td style="padding:32px 28px;">
            <p style="margin:0 0 16px;font-size:18px;font-weight:600;color:#0f172a;">Hola de nuevo, ${name} 👋</p>
            <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.7;">
              Hace unos días nos escribiste y quería asegurarme de que recibiste mi respuesta correctamente.
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.7;">
              Si todavía tienes el proyecto en mente, estaré encantado de hablar contigo.
              Una llamada de 15 minutos suele ser suficiente para aclarar todo y darte un presupuesto exacto.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding:8px 0;">
                  <a href="mailto:juangutierrezdelaconcha@mindbride.net?subject=Re: Mi proyecto digital"
                     style="display:inline-block;background:linear-gradient(135deg,#10b981,#0ea5e9);color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:14px 32px;border-radius:10px;">
                    Retomar la conversación
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:24px 0 0;font-size:13px;color:#94a3b8;text-align:center;">
              Si ya no estás interesado, no hace falta que respondas. Sin compromiso.
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#f8fafc;padding:20px 28px;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
              <strong style="color:#0f172a;">Juan Gutiérrez de la Concha</strong> · Mindbridge IA<br/>
              <a href="mailto:juangutierrezdelaconcha@mindbride.net" style="color:#10b981;text-decoration:none;">juangutierrezdelaconcha@mindbride.net</a> ·
              <a href="https://mindbride.net" style="color:#10b981;text-decoration:none;">mindbride.net</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}
