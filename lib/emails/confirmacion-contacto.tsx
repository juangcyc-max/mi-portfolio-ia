export function confirmacionContactoHtml({ name }: { name: string }) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:system-ui,sans-serif;background:#f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#10b981,#0ea5e9);padding:32px 24px;text-align:center;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Mindbridge IA</p>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.8);">Desarrollo Web · Cloud · Inteligencia Artificial</p>
          </td>
        </tr>

        <!-- Cuerpo -->
        <tr>
          <td style="padding:32px 28px;">
            <p style="margin:0 0 16px;font-size:18px;font-weight:600;color:#0f172a;">Hola, ${name} 👋</p>
            <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.7;">
              He recibido tu mensaje y te responderé en menos de <strong>24 horas</strong>.
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.7;">
              Mientras tanto, si tienes alguna duda urgente puedes responder directamente a este email.
            </p>

            <!-- Separador -->
            <div style="border-top:1px solid #e2e8f0;margin:24px 0;"></div>

            <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">¿Qué hago ahora?</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                  <p style="margin:0;font-size:14px;color:#0f172a;">📋 <strong>Reviso tu mensaje</strong> y preparo una propuesta personalizada</p>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                  <p style="margin:0;font-size:14px;color:#0f172a;">💡 <strong>Te envío un presupuesto</strong> detallado adaptado a tu proyecto</p>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;">
                  <p style="margin:0;font-size:14px;color:#0f172a;">📞 <strong>Coordinamos una llamada</strong> de 15 min si lo necesitas</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
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
