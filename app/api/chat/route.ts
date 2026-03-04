import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    
    // Modo demo si no hay API key válida
    if (!apiKey || apiKey === "hf_xxxxx") {
      return NextResponse.json({ 
        response: "[Demo] Hola. En producción, conectaré con IA real para responder sobre servicios web, integración de IA y marketing. ¿En qué puedo ayudarte?" 
      });
    }

    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 });
    }

    // URL limpia sin espacios al final
    const modelUrl = "https://router.huggingface.co/hf-inference/models/gpt2";

    const response = await fetch(modelUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: message,
        parameters: {
          max_new_tokens: 80,
          temperature: 0.7,
          do_sample: true
        }
      })
    });

    // Manejar carga en frío del modelo
    if (response.status === 503) {
      return NextResponse.json({ 
        response: "Activando asistente... espera 10 segundos y vuelve a enviar." 
      });
    }

    let text = "";
    
    if (response.ok) {
      const data = await response.json();
      const fullText = Array.isArray(data) ? data[0]?.generated_text : "";
      text = fullText?.replace(message, "")?.trim() || "Sin respuesta";
    } else {
      // Fallback a modo demo si la API falla
      text = `[Demo] Recibí: "${message}". En producción, una IA real respondería sobre mis servicios de desarrollo web, integración de IA y marketing digital.`;
    }

    // Guardar consulta en Supabase (async, sin bloquear la respuesta)
    supabase
      .from("chat_queries")
      .insert({
        user_message: message,
        ai_response: text,
        status: response.ok ? "success" : "fallback"
      })
      .then(({ error }) => {
        if (error) {
          console.error("Error guardando en Supabase:", error.message);
        }
      });

    return NextResponse.json({ response: text });
    
  } catch (error: any) {
    // Fallback en caso de error crítico
    const demoResponse = "[Demo] Estoy en modo demostración. En producción, conectaré con IA real para asistir a tus clientes. ¿En qué puedo ayudarte hoy?";
    
    // Intentar guardar el error en Supabase
    try {
      await supabase.from("chat_queries").insert({
        user_message: "ERROR",
        ai_response: demoResponse,
        status: "error"
      });
    } catch (dbError) {
      console.error("Error guardando error en Supabase:", dbError);
    }
    
    return NextResponse.json({ response: demoResponse }, { status: 200 });
  }
}