import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { seguimientoLeadHtml } from "@/lib/emails/seguimiento-lead";

export async function GET(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  // Verificar que es una llamada autorizada de Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Leads nuevos sin actividad en 3 días (primer seguimiento)
    const { data: leadsToFollow } = await supabase
      .from("leads")
      .select("id, name, email")
      .eq("status", "new")
      .lt("created_at", threeDaysAgo.toISOString())
      .gt("created_at", sevenDaysAgo.toISOString());

    if (!leadsToFollow || leadsToFollow.length === 0) {
      return NextResponse.json({ sent: 0, message: "No hay leads para seguimiento" });
    }

    let sent = 0;
    for (const lead of leadsToFollow) {
      const { error } = await resend.emails.send({
        from: "Juan · Mindbridge IA <hola@mindbride.net>",
        to: [lead.email],
        subject: `¿Sigues interesado, ${lead.name}?`,
        html: seguimientoLeadHtml({ name: lead.name }),
        text: `Hola ${lead.name}, hace unos días nos escribiste. ¿Sigues con el proyecto en mente? Responde a este email y lo retomamos. Juan · Mindbridge IA`,
      });

      if (!error) {
        // Actualizar estado del lead a 'contacted'
        await supabase
          .from("leads")
          .update({ status: "contacted" })
          .eq("id", lead.id);
        sent++;
      }
    }

    return NextResponse.json({ sent, message: `${sent} emails de seguimiento enviados` });
  } catch (error) {
    console.error("Error en cron de seguimiento:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
