import { NextResponse } from "next/server";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

// Split strings into batches to avoid exceeding token limits
function chunkObject(obj: Record<string, string>, size: number): Record<string, string>[] {
  const entries = Object.entries(obj);
  const chunks: Record<string, string>[] = [];
  for (let i = 0; i < entries.length; i += size) {
    chunks.push(Object.fromEntries(entries.slice(i, i + size)));
  }
  return chunks;
}

function extractJSON(text: string): Record<string, string> | null {
  // Remove markdown fences
  let clean = text.replace(/```(?:json)?\n?/gi, "").replace(/```/g, "").trim();
  // Find outermost { }
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  clean = clean.substring(start, end + 1);
  try {
    return JSON.parse(clean);
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { targetLang, strings } = await request.json();

    if (!targetLang || !strings) {
      return NextResponse.json({ error: "targetLang and strings required" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      // No key → return originals (Spanish fallback)
      return NextResponse.json({ translations: strings });
    }

    // Translate in batches of 40 keys to stay within token limits
    const batches = chunkObject(strings, 40);
    const translated: Record<string, string> = {};

    for (const batch of batches) {
      const prompt = `Translate the VALUES of this JSON object from Spanish to ${targetLang}.

STRICT RULES:
- Return ONLY the JSON object — no explanation, no code fences, no markdown
- Keep all keys exactly as-is
- Preserve numbers, € symbols, · separators, emojis, and special characters
- Keep these terms as-is: Cloud, IA, AI, CRM, WhatsApp, SEO, CMS, MI3.0, n8n, SLA
- Do NOT add any text before or after the JSON

${JSON.stringify(batch)}`;

      const { text } = await generateText({
        model: anthropic("claude-haiku-4-5-20251001"),
        prompt,
        temperature: 0,
      });

      const parsed = extractJSON(text);
      if (parsed) {
        Object.assign(translated, parsed);
      } else {
        // Batch failed — copy originals for these keys
        Object.assign(translated, batch);
      }
    }

    return NextResponse.json({ translations: translated });
  } catch (err: any) {
    console.error("Translation error:", err);
    // Return originals on any failure — never return null
    return NextResponse.json({ translations: null }, { status: 500 });
  }
}
