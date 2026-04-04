// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { rateLimit } from "@/lib/rateLimit";
import { confirmacionContactoHtml } from "@/lib/emails/confirmacion-contacto";


// IMPORTANTE: En producción, NEXT_PUBLIC_SITE_URL debe ser tu dominio real (ej. https://mindbridge.ia)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// 1. Extraemos el HTML a una función para mantener la ruta limpia
function getEmailTemplate({ name, email, message, projectType, budget, logoUrl }: any) {
  const date = new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Public Sans', system-ui, sans-serif; background-color: #f8fafc; color: #0f172a;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
              
              <tr>
                <td style="background-color: #ffffff; padding: 32px 24px; text-align: center; border-bottom: 2px solid #e2e8f0;">
                  <img src="${logoUrl}" alt="Mindbridge IA" width="180" style="display: block; margin: 0 auto; max-width: 180px; height: auto;" />
                </td>
              </tr>
              
              <tr>
                <td style="padding: 32px 24px;">
                  <h1 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 700; color: #0f172a;">
                    📩 Nuevo mensaje desde el sitio web
                  </h1>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 0;">
                        <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b;">
                          <strong style="color: #0f172a; display: block; margin-bottom: 4px;">👤 Nombre</strong>
                          <span style="color: #0f172a; font-size: 16px;">${name}</span>
                        </p>
                        <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b;">
                          <strong style="color: #0f172a; display: block; margin-bottom: 4px;">📧 Email</strong>
                          <span style="color: #0f172a; font-size: 16px;">${email}</span>
                        </p>
                        ${projectType ? `<p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b;"><strong style="color: #0f172a; display: block; margin-bottom: 4px;">📋 Tipo de proyecto</strong><span style="color: #0f172a; font-size: 16px;">${projectType}</span></p>` : ""}
                        ${budget ? `<p style="margin: 0; font-size: 14px; color: #64748b;"><strong style="color: #0f172a; display: block; margin-bottom: 4px;">💰 Presupuesto estimado</strong><span style="color: #0f172a; font-size: 16px;">${budget}</span></p>` : ""}
                      </td>
                    </tr>
                  </table>
                  
                  <div style="background-color: #ffffff; border-left: 4px solid #10b981; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
                    <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #0f172a;">💬 Mensaje</p>
                    <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                  </div>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 32px;">
                    <tr>
                      <td align="center">
                        <a href="mailto:${email}?subject=Re: Tu proyecto con Mindbridge IA" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #22d3ee 100%); color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 32px; border-radius: 10px;">
                          Responder ahora
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <tr>
                <td style="background-color: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                    Este mensaje fue enviado desde el formulario de contacto de<br />
                    <strong style="color: #0f172a;">Mindbridge IA</strong> — Desarrollo Web + Inteligencia Artificial
                  </p>
                  <p style="margin: 12px 0 0 0; font-size: 11px; color: #cbd5e1;">
                    ${date}
                  </p>
                </td>
              </tr>
            </table>
            <div style="height: 40px;"></div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export async function POST(request: Request) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    if (!rateLimit(ip, 5, 60_000)) {
      return NextResponse.json({ error: "Demasiadas solicitudes. Espera un momento." }, { status: 429 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const data = await request.json();
    const { name, email, message, budget, projectType } = data;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nombre, email y mensaje son obligatorios" },
        { status: 400 }
      );
    }

    // ✅ CAMBIADO: logo.svg (tu formato original)
    const logoUrl = `${SITE_URL}/logo.svg`; 

    const { error: resendError } = await resend.emails.send({
      from: "Mindbridge IA <hola@mindbride.net>",
      to: ["juangutierrezdelaconcha@mindbride.net"],
      replyTo: email,
      subject: `Nuevo mensaje - ${name}${projectType ? ` | ${projectType}` : ""}`,
      html: getEmailTemplate({ name, email, message, projectType, budget, logoUrl }),
      text: `Nuevo mensaje de: ${name} (${email})\n\nMensaje: ${message}`,
    });

    if (resendError) {
      console.error("Error de Resend:", resendError);
      return NextResponse.json(
        { error: "Error al enviar el mensaje a través del proveedor" },
        { status: 500 }
      );
    }

    // Email de confirmación al cliente
    await resend.emails.send({
      from: "Juan · Mindbridge IA <hola@mindbride.net>",
      to: [email],
      subject: `He recibido tu mensaje, ${name} ✅`,
      html: confirmacionContactoHtml({ name }),
      text: `Hola ${name}, he recibido tu mensaje y te responderé en menos de 24 horas. Un saludo, Juan · Mindbridge IA`,
    });

    // Guardar lead y mensaje en Supabase
    const { data: lead, error: leadError } = await supabaseAdmin
      .from("leads")
      .insert({ name, email, source: "contact_form", status: "new" })
      .select("id")
      .single();

    if (leadError) console.error("Error insertando lead:", leadError);

    if (lead?.id) {
      await supabaseAdmin.from("messages").insert({
        lead_id: lead.id,
        name,
        email,
        subject: projectType || "Contacto web",
        body: message,
        source: "contact_form",
        status: "unread",
        priority: "normal",
      });
    }

    // Enviar notificación push al móvil admin
    try {
      const { data: tokens } = await supabaseAdmin.from('push_tokens').select('token');
      if (tokens && tokens.length > 0) {
        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tokens.map((t: { token: string }) => ({
            to: t.token,
            title: `Nuevo mensaje de ${name}`,
            body: message.slice(0, 100),
            sound: 'default',
          }))),
        });
      }
    } catch (pushError) {
      console.error('Error enviando push:', pushError);
    }

    return NextResponse.json(
      { success: true, message: "Email enviado correctamente" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error inesperado en API de contacto:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}