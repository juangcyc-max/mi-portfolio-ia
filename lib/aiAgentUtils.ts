import type { LangCode } from "@/lib/i18n/LanguageContext";

export const SECTIONS: Record<string, string> = {
  hero: "hero",
  portfolio: "portfolio",
  servicios: "servicios",
  planes: "planes",
  "servicios-medida": "servicios-medida",
  testimonios: "testimonios",
  tecnologias: "tecnologias",
  demo: "demo",
  presupuesto: "presupuesto",
  contacto: "contacto",
};

export type Msg = { role: "user" | "assistant"; content: string };
export type AgentState = "idle" | "listening" | "thinking" | "speaking";
export type TourStep = { sectionId: string; text: string };

export function parseTourSteps(raw: string): TourStep[] {
  if (!raw.includes("[[STEP:")) return [];
  const steps: TourStep[] = [];
  const re = /\[\[STEP:([\w-]+)\|([\s\S]+?)\]\]/g;
  let m;
  while ((m = re.exec(raw)) !== null) {
    const id = m[1].trim();
    const text = m[2].trim();
    if (SECTIONS[id] && text) steps.push({ sectionId: id, text });
  }
  return steps;
}

export function parseScrollCmd(raw: string): string | null {
  const m = raw.match(/\[\[SCROLL:([\w-]+)\]\]/);
  return m && SECTIONS[m[1]] ? m[1] : null;
}

export function cleanText(raw: string): string {
  return raw
    .replace(/\[\[TOUR_START\]\]/gi, "")
    .replace(/\[\[TOUR_END\]\]/gi, "")
    .replace(/\[\[STEP:[\w-]+\|[\s\S]+?\]\]/g, "")
    .replace(/\[\[SCROLL:[\w-]+\]\]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function scrollToSection(id: string) {
  const el = id === "hero" ? document.body : document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  if (id !== "hero") {
    el.classList.add("ai-tour-highlight");
    setTimeout(() => el.classList.remove("ai-tour-highlight"), 2500);
  }
}

export const LANG_SPEECH: Record<LangCode, { bcp47: string; prefix: string }> = {
  es: { bcp47: "es-ES", prefix: "es" },
  en: { bcp47: "en-US", prefix: "en" },
  zh: { bcp47: "zh-CN", prefix: "zh" },
};

export function speakPromise(
  text: string,
  voices: SpeechSynthesisVoice[],
  lang: LangCode
): Promise<void> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) return resolve();
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const { bcp47, prefix } = LANG_SPEECH[lang];
    u.lang = bcp47;
    u.rate = lang === "zh" ? 0.95 : 1.05;
    const v =
      voices.find((v) => v.lang === bcp47 && v.name.includes("Google")) ||
      voices.find((v) => v.lang === bcp47) ||
      voices.find((v) => v.lang.startsWith(prefix));
    if (v) u.voice = v;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

export function renderMsg(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>")
}

export function cleanForSpeech(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/#{1,6}\s*/g, "")
    .replace(/•/g, ",")
    .replace(/→/g, ".")
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, "")
    .replace(/[☀-➿]/gu, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, ", ")
    .replace(/\s{2,}/g, " ")
    .trim();
}
