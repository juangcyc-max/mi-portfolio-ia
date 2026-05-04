"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, VolumeX, Send, X, Loader2, Bot } from "lucide-react";

/* ─── Secciones disponibles para navegación ─── */
const SECTIONS: Record<string, string> = {
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

type Msg = { role: "user" | "assistant"; content: string };
type AgentState = "idle" | "listening" | "thinking" | "speaking";
type TourStep = { sectionId: string; text: string };

/* ─── Parsers de comandos ─── */
function parseTourSteps(raw: string): TourStep[] {
  if (!raw.includes("[[STEP:")) return [];
  const steps: TourStep[] = [];
  // Captura [[STEP:id|texto]] donde texto puede contener cualquier cosa excepto ]]
  const re = /\[\[STEP:([\w-]+)\|([\s\S]+?)\]\]/g;
  let m;
  while ((m = re.exec(raw)) !== null) {
    const id = m[1].trim();
    const text = m[2].trim();
    if (SECTIONS[id] && text) steps.push({ sectionId: id, text });
  }
  return steps;
}

function parseScrollCmd(raw: string): string | null {
  const m = raw.match(/\[\[SCROLL:([\w-]+)\]\]/);
  return m && SECTIONS[m[1]] ? m[1] : null;
}

function cleanText(raw: string): string {
  return raw
    .replace(/\[\[TOUR_START\]\]/gi, "")
    .replace(/\[\[TOUR_END\]\]/gi, "")
    .replace(/\[\[STEP:[\w-]+\|[\s\S]+?\]\]/g, "")
    .replace(/\[\[SCROLL:[\w-]+\]\]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/* ─── Scroll + highlight de sección ─── */
function scrollToSection(id: string) {
  const el = id === "hero"
    ? document.body
    : document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  if (id !== "hero") {
    el.classList.add("ai-tour-highlight");
    setTimeout(() => el.classList.remove("ai-tour-highlight"), 2500);
  }
}

/* ─── SpeechSynthesis promise ─── */
function speakPromise(
  text: string,
  voices: SpeechSynthesisVoice[]
): Promise<void> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) return resolve();
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-ES";
    u.rate = 1.05;
    const v =
      voices.find((v) => v.lang === "es-ES" && v.name.includes("Google")) ||
      voices.find((v) => v.lang === "es-ES") ||
      voices.find((v) => v.lang.startsWith("es"));
    if (v) u.voice = v;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

/* ─── Markdown mínimo ─── */
function renderMsg(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

/* ═══════════════════════════════════════════════
   COMPONENTE
═══════════════════════════════════════════════ */
const QUICK_ACTIONS = [
  { label: "🗺️ Tour de la web", msg: "Haz un tour completo de la web" },
  { label: "💰 Ver precios", msg: "Muéstrame los planes y precios" },
  { label: "🧮 Calcular presupuesto", msg: "Quiero calcular un presupuesto personalizado" },
  { label: "📱 App móvil", msg: "¿Cómo funciona el servicio de app móvil?" },
  { label: "🤖 Agente de voz", msg: "Cuéntame sobre el agente de voz IA" },
  { label: "⚠️ Reportar problema", msg: "Quiero reportar un problema o incidencia" },
];

export default function AIAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hola 👋 Soy **MI3**, el asistente de Mindbridge IA.\n\nPuedo ayudarte con precios, hacer un **tour de la web**, calcular presupuestos o gestionar incidencias. Escribe, usa el micrófono, o elige una opción:",
    },
  ]);
  const [input, setInput] = useState("");
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [touring, setTouring] = useState(false);
  const [showChips, setShowChips] = useState(true);

  const sessionId = useRef(`agent-${Date.now()}`);
  const conversationIdRef = useRef<string | null>(null);
  const historyRef = useRef<Msg[]>(messages);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const recognitionRef = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const tourAbortRef = useRef(false);

  /* Cargar voces */
  useEffect(() => {
    const load = () => { voicesRef.current = window.speechSynthesis?.getVoices() ?? []; };
    load();
    window.speechSynthesis?.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", load);
  }, []);

  /* Scroll al último mensaje */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, agentState]);

  /* Sync historyRef */
  useEffect(() => { historyRef.current = messages; }, [messages]);

  /* ─── Ejecutar tour ─── */
  const executeTour = useCallback(async (steps: TourStep[]) => {
    setTouring(true);
    tourAbortRef.current = false;
    for (const step of steps) {
      if (tourAbortRef.current) break;
      scrollToSection(step.sectionId);
      setAgentState("speaking");
      if (voiceEnabled) {
        await speakPromise(step.text, voicesRef.current);
      } else {
        await new Promise((r) => setTimeout(r, 2000));
      }
      if (tourAbortRef.current) break;
      await new Promise((r) => setTimeout(r, 600));
    }
    setAgentState("idle");
    setTouring(false);
  }, [voiceEnabled]);

  /* ─── Hablar respuesta normal ─── */
  const speakReply = useCallback((text: string) => {
    if (!voiceEnabled) return;
    setAgentState("speaking");
    speakPromise(text, voicesRef.current).then(() => setAgentState("idle"));
  }, [voiceEnabled]);

  /* ─── Enviar mensaje ─── */
  const sendMessage = useCallback(async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed) return;
    setShowChips(false);
    const userMsg: Msg = { role: "user", content: trimmed };
    const newHistory = [...historyRef.current, userMsg];
    setMessages(newHistory);
    historyRef.current = newHistory;
    setInput("");
    setAgentState("thinking");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory,
          sessionId: sessionId.current,
          conversationId: conversationIdRef.current,
        }),
      });
      const data = await res.json();
      if (data.conversationId) conversationIdRef.current = data.conversationId;
      const raw: string = data.text ?? "Lo siento, algo ha fallado. Inténtalo de nuevo.";

      /* Detectar tour */
      const tourSteps = parseTourSteps(raw);
      /* Detectar scroll simple */
      const scrollTarget = parseScrollCmd(raw);
      /* Texto limpio para mostrar y hablar */
      const displayText = cleanText(raw);

      const assistantMsg: Msg = { role: "assistant", content: displayText };
      const msgs: Msg[] = [...historyRef.current, assistantMsg];
      if (data.incidentDetected) {
        msgs.push({
          role: "assistant",
          content: "✅ **Incidencia registrada.** Juan recibirá una notificación ahora mismo y te contactará lo antes posible.",
        });
      }
      setMessages(msgs);
      historyRef.current = msgs;

      if (tourSteps.length > 0) {
        setAgentState("idle");
        await executeTour(tourSteps);
      } else if (scrollTarget) {
        scrollToSection(scrollTarget);
        speakReply(displayText);
      } else {
        speakReply(displayText);
      }
    } catch {
      setAgentState("idle");
      const err: Msg = { role: "assistant", content: "Error de conexión. Por favor, inténtalo de nuevo." };
      setMessages((prev) => [...prev, err]);
    }
  }, [executeTour, speakReply]);

  /* ─── Voz: escuchar ─── */
  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.",
      }]);
      return;
    }
    window.speechSynthesis?.cancel();
    tourAbortRef.current = true;
    const rec = new SR();
    rec.lang = "es-ES";
    rec.interimResults = false;
    rec.onstart = () => setAgentState("listening");
    rec.onresult = (e: any) => sendMessage(e.results[0][0].transcript);
    rec.onerror = () => setAgentState("idle");
    rec.onend = () => setAgentState((s) => s === "listening" ? "idle" : s);
    recognitionRef.current = rec;
    rec.start();
  }, [sendMessage]);

  const stopListening = () => { recognitionRef.current?.stop(); setAgentState("idle"); };
  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    tourAbortRef.current = true;
    setAgentState("idle");
    setTouring(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const isThinking = agentState === "thinking";
  const isListening = agentState === "listening";
  const isSpeaking = agentState === "speaking";

  return (
    <>
      {/* CSS highlight para el tour */}
      <style>{`
        .ai-tour-highlight {
          outline: 3px solid #10b981;
          outline-offset: 6px;
          border-radius: 12px;
          transition: outline 0.3s;
          animation: ai-glow 2.5s ease-in-out;
        }
        @keyframes ai-glow {
          0%   { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
          30%  { box-shadow: 0 0 0 20px rgba(16,185,129,0.15); }
          100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
        }
      `}</style>

      {/* Botón flotante */}
      <div className="fixed bottom-6 left-6 z-50">
        <motion.button
          onClick={() => setOpen(!open)}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.93 }}
          aria-label="Abrir asistente IA"
          className={`w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center transition-colors ${
            open
              ? "bg-slate-700 shadow-slate-500/20"
              : "bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/30"
          }`}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                <X size={22} color="white" />
              </motion.div>
            ) : (
              <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                <Bot size={22} color="white" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Indicador estado */}
          {!open && (isSpeaking || isListening || isThinking) && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white animate-pulse bg-cyan-400" />
          )}
        </motion.button>
      </div>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-24 left-6 z-50 w-[340px] sm:w-[380px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col overflow-hidden"
            style={{ maxHeight: "70vh" }}
          >
            {/* Header */}
            <div className="bg-emerald-500 px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2.5 h-2.5 rounded-full bg-white"
                  animate={isSpeaking || isListening
                    ? { opacity: [1, 0.3, 1] }
                    : { opacity: 0.5 }}
                  transition={isSpeaking || isListening
                    ? { duration: 0.8, repeat: Infinity }
                    : {}}
                />
                <span className="text-white text-sm font-bold">MI3 · Asistente IA</span>
                {touring && (
                  <span className="text-emerald-100 text-xs ml-1">· Tour activo</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setVoiceEnabled((v) => !v);
                    if (voiceEnabled) { window.speechSynthesis?.cancel(); setAgentState("idle"); }
                  }}
                  className="text-white/70 hover:text-white transition-colors"
                  title={voiceEnabled ? "Silenciar voz" : "Activar voz"}
                >
                  {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
                <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl leading-relaxed ${
                      m.role === "user"
                        ? "bg-emerald-500 text-white rounded-br-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm"
                    }`}
                    dangerouslySetInnerHTML={{ __html: renderMsg(m.content) }}
                  />
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2.5 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                    {[0, 0.2, 0.4].map((d) => (
                      <motion.span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full bg-slate-400"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: d }}
                      />
                    ))}
                  </div>
                </div>
              )}
              {isSpeaking && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-2xl rounded-bl-sm border border-emerald-200 dark:border-emerald-700">
                    {[...Array(5)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="w-0.5 bg-emerald-400 rounded-full"
                        animate={{ height: [3, 12, 3] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
                      />
                    ))}
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 ml-1">
                      {touring ? "Tour…" : "Hablando…"}
                    </span>
                    <button onClick={stopSpeaking} className="ml-1 text-emerald-500 hover:text-emerald-700">
                      <X size={12} />
                    </button>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick action chips */}
            {showChips && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {QUICK_ACTIONS.map((a) => (
                  <button
                    key={a.label}
                    onClick={() => sendMessage(a.msg)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 border border-slate-200 dark:border-white/10 transition-colors"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-3 py-3 border-t border-slate-100 dark:border-white/10 shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  disabled={isThinking || isListening}
                  rows={1}
                  placeholder={isListening ? "Escuchando…" : "Escribe o usa el micrófono…"}
                  className="flex-1 resize-none bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50 max-h-28 overflow-y-auto"
                  style={{ scrollbarWidth: "none" }}
                />

                {/* Mic */}
                {isListening ? (
                  <button
                    onClick={stopListening}
                    className="w-9 h-9 shrink-0 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center animate-pulse"
                  >
                    <MicOff size={16} />
                  </button>
                ) : (
                  <button
                    onClick={startListening}
                    disabled={isThinking || isSpeaking}
                    className="w-9 h-9 shrink-0 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-slate-600 dark:text-slate-300 hover:text-emerald-600 flex items-center justify-center transition-colors disabled:opacity-40"
                  >
                    <Mic size={16} />
                  </button>
                )}

                {/* Send */}
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isThinking || isListening}
                  className="w-9 h-9 shrink-0 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors disabled:opacity-40"
                >
                  {isThinking ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                Prueba: "haz un tour de la web" o "muéstrame los precios"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
