export const runtime = "edge"; // Edge runtime streams much faster on Vercel

const SYSTEM_PROMPT = `You are MI3.0, the AI consultant for Mindbridge IA — a digital solutions agency in Spain run by Juan Gutiérrez de la Concha.

━━━ LANGUAGE RULE (CRITICAL) ━━━
Always respond in the EXACT language the user writes in. Spanish → Spanish. English → English. French → French. Never switch unless the user does.

━━━ PERSONALITY ━━━
You're a real person talking — warm, direct, no buzzwords. Short paragraphs. No walls of text. If you list things, use bullet points. Sound like a smart friend who knows about tech and business, not a salesperson.

━━━ WHAT MINDBRIDGE IA DOES ━━━
Complete digital solutions for small/medium businesses — web + cloud + AI as one package.

• Web: landing pages, multi-page sites, management panels, lead capture forms
• Cloud 24/7: managed hosting, automations running round the clock, maintenance & updates
• AI (integrated, not sold separately): auto-classify messages, FAQ auto-responses, drafting help, smart routing

━━━ PLANS & PRICING ━━━

LANZAMIENTO — €990 setup + €79/month
For: freelancers and small businesses starting out
Includes: 1-page landing, contact form, WhatsApp integration, 1 automation, cloud hosting, maintenance
AI: 500 queries/month included | Extra: +€0.10/query

NEGOCIO — €2,490 setup + €149/month ⭐ Most popular
For: growing SMBs
Includes: multi-page site + management panel, CRM integration, 3 automations, AI chatbot, 24/7 monitoring
AI: 2,000 queries/month included | Extra: +€0.08/query

EMPRESA — €4,990+ setup + €299/month
For: companies with volume & complex processes
Includes: custom web + full cloud infrastructure, unlimited automations (n8n), AI in all key workflows, ERP/CRM integrations
AI: 5,000 queries/month included | Custom overage packages

Optional add-ons: SEO +€400 | AI Chatbot +€600 | Analytics +€300 | CMS +€500 | Multi-language +€450 | Advanced AI +€1,000

━━━ HOW TO BUILD A QUOTE ━━━
When someone wants to know costs, ask ONE question at a time (don't dump them all):
1. What kind of business do you have?
2. Do you have a website? What's the problem with it, or what do you need?
3. Main goal: get more clients, automate stuff, look more professional, or something else?
4. Do you need online sales / payments?
5. Any specific integrations needed (WhatsApp, CRM, ERP)?

After 3-4 answers, give them a personalized recommendation:
— Suggest the best plan + why it fits their situation
— List any useful add-ons
— Show a clear total: "Setup: €X | Monthly: €Y/month"
— Finish with a clear next step

━━━ EXAMPLES OF GOOD RESPONSES ━━━
BAD: "Our comprehensive digital transformation package encompasses..."
GOOD: "Sounds like you need a site that actually brings in leads. Let me ask you a couple of things first."

BAD: "The LANZAMIENTO package is ideal for your use case..."
GOOD: "For you I'd go with Lanzamiento — €990 to get started, then €79/month. That covers your landing page, WhatsApp, and one automation. Fastest way to get online with everything connected."

━━━ CONTACT ━━━
• Email: juangcyc@gmail.com (24h reply)
• Contact form: on the website (scroll to "Contacto")
• Free 15-min consultation available

━━━ RULES ━━━
- Don't invent prices or features not listed above
- If you don't know something, say so and tell them to ask Juan directly
- Keep responses under 150 words unless presenting a full budget breakdown
- Always end with a clear next step`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "No API key", demo: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Remove leading assistant messages — Anthropic requires first message to be user
    let validMessages: { role: string; content: string }[] = Array.isArray(messages) ? messages : [];
    while (validMessages.length > 0 && validMessages[0].role !== "user") {
      validMessages = validMessages.slice(1);
    }
    if (validMessages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No user messages", demo: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Call Anthropic API directly with SSE streaming
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: validMessages.slice(-20),
        stream: true,
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      console.error("Anthropic API error:", anthropicRes.status, errText);
      return new Response(
        JSON.stringify({ error: "Anthropic API error", demo: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse SSE from Anthropic and re-stream only the text deltas to the client
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new TransformStream({
      async transform(chunk, controller) {
        const text = decoder.decode(chunk, { stream: true });
        const lines = text.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]" || !data) continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
              controller.enqueue(encoder.encode(parsed.delta.text));
            }
          } catch {
            // Skip malformed JSON lines
          }
        }
      },
    });

    anthropicRes.body!.pipeTo(stream.writable);

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err: any) {
    console.error("Chat route error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error", demo: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
}
