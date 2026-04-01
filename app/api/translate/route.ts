import { NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(request: Request) {
  try {
    const { targetLang, strings } = await request.json();

    if (!targetLang || !strings) {
      return NextResponse.json({ error: "targetLang and strings required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ translations: strings });
    }

    const google = createGoogleGenerativeAI({ apiKey });

    const stringEntries = JSON.stringify(strings, null, 2);

    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      prompt: `You are a professional translator. Translate the following JSON object's VALUES (not keys) from Spanish to ${targetLang}.

RULES:
- Keep all JSON keys exactly as they are
- Only translate the string values
- Preserve any HTML tags, special characters, · separators, € symbols, and numbers
- Keep technical terms like "Cloud", "IA", "AI", "CRM", "WhatsApp", "SEO", "CMS" as-is or use the common term in the target language
- Return ONLY valid JSON, no explanation, no markdown code blocks
- The output must be a valid JSON object

Input JSON:
${stringEntries}`,
    });

    // Strip markdown code fences if model adds them
    const clean = text.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
    const translations = JSON.parse(clean);

    return NextResponse.json({ translations });
  } catch (err: any) {
    console.error("Translation error:", err);
    // Return original strings as fallback
    return NextResponse.json({ translations: null }, { status: 500 });
  }
}
