"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  ts: number;
}

// Detect dominant language of a string
function detectLang(text: string): "es" | "en" {
  const esWords = /\b(hola|qué|cómo|para|tengo|quiero|necesito|gracias|puedo|este|esta|pero|cuando|precio|servicio|negocio|empresa|web|ayuda|buenas|bueno|tienes|también|más|información|quisiera|cuánto|dónde|hace|estoy)\b/i;
  const enWords = /\b(hello|hi|what|how|for|have|want|need|thanks|can|this|but|when|price|service|business|company|web|help|good|do|you|also|more|information|would|much|where|does|i'm|i've)\b/i;
  const esCount = (text.match(esWords) || []).length;
  const enCount = (text.match(enWords) || []).length;
  return enCount > esCount ? "en" : "es";
}

const GREETINGS: Record<string, string> = {
  es: "Hola 👋 Soy **MI3.0**, el asistente de Mindbridge IA.\n\nEstoy aquí para ayudarte a encontrar la solución digital ideal para tu negocio — web, automatización cloud e IA integrada.\n\n¿Cuéntame, qué tipo de negocio tienes?",
  en: "Hi 👋 I'm **MI3.0**, Mindbridge IA's assistant.\n\nI'm here to help you find the right digital solution for your business — web, cloud automation and integrated AI.\n\nTell me, what kind of business do you have?",
};

const OFFLINE: Record<string, string> = {
  es: "El servicio de IA no está disponible ahora mismo. Escríbenos directamente a **juangcyc@gmail.com** o usa el formulario de contacto.",
  en: "The AI service is temporarily unavailable. Contact us directly at **juangcyc@gmail.com** or use the contact form.",
};

export default function ChatBox() {
  const { lang } = useTranslation();
  const [msgLang, setMsgLang] = useState<"es" | "en">(lang as "es" | "en");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const sessionId = useRef<string>(`session-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<boolean>(false);

  // Build greeting based on UI language on first mount
  useEffect(() => {
    const l = (lang === "en" ? "en" : "es") as "es" | "en";
    setMsgLang(l);
    setMessages([{ role: "assistant", content: GREETINGS[l], ts: Date.now() }]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Animate text word-by-word for a natural feel
  const animateText = useCallback(async (text: string) => {
    const words = text.split(/(\s+)/);
    let out = "";
    setMessages((prev) => [...prev, { role: "assistant", content: "", ts: Date.now() }]);
    for (let i = 0; i < words.length; i++) {
      if (abortRef.current) break;
      out += words[i];
      const snapshot = out;
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], content: snapshot };
        return next;
      });
      // Vary speed: punctuation = longer pause, normal words = short
      const delay = /[.!?]/.test(words[i]) ? 60 : /,/.test(words[i]) ? 35 : 18;
      await new Promise((r) => setTimeout(r, delay));
    }
  }, []);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    // Detect language from user input
    const detected = detectLang(text);
    setMsgLang(detected);

    const userMsg: Message = { role: "user", content: text, ts: Date.now() };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsTyping(true);
    abortRef.current = false;

    try {
      const apiMessages = history
        .filter((m, i) => !(i === 0 && m.role === "assistant")) // skip greeting
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          sessionId: sessionId.current,
          conversationId,
        }),
      });

      const data = await res.json();
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      setIsTyping(false);

      if (data.error || !data.text) {
        // Show debug info in development so we know exactly what failed
        const debugMsg = data.debug ? `\n\n_(debug: ${data.debug})_` : "";
        await animateText(OFFLINE[detected] + debugMsg);
        return;
      }

      await animateText(data.text);
    } catch (fetchErr: any) {
      console.error("[ChatBox] fetch error:", fetchErr?.message);
      setIsTyping(false);
      await animateText(OFFLINE[detected]);
    }
  }, [input, isTyping, messages, animateText]);

  const clearChat = () => {
    abortRef.current = true;
    const l = msgLang;
    setMessages([{ role: "assistant", content: GREETINGS[l], ts: Date.now() }]);
    setIsTyping(false);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Markdown renderer: **bold**, bullet points (• or -)
  const renderContent = (content: string) => {
    if (!content) return null;
    return content.split("\n").map((line, i, arr) => {
      const isBullet = /^[•\-]\s/.test(line);
      const parts = line.replace(/^[•\-]\s/, "").split(/\*\*(.*?)\*\*/g);
      const rendered = parts.map((part, j) =>
        j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{part}</strong> : part
      );
      if (isBullet) {
        return (
          <div key={i} className="flex gap-2 items-start">
            <span className="text-emerald-400 mt-0.5 flex-shrink-0">•</span>
            <span>{rendered}</span>
          </div>
        );
      }
      return (
        <span key={i}>
          {rendered}
          {i < arr.length - 1 && <br />}
        </span>
      );
    });
  };

  const placeholder = msgLang === "en" ? "Type your message..." : "Escribe tu mensaje...";
  const clearLabel = msgLang === "en" ? "Clear chat" : "Limpiar chat";

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[680px] sm:h-[700px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/90 backdrop-blur-xl">

      {/* ── Header ── */}
      <div className="px-5 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-emerald-500/50 bg-slate-800">
              <Image src="/logo.svg" alt="MI3.0" width={40} height={40} />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">MI3.0 · Mindbridge</p>
            <p className="text-xs text-emerald-400 font-medium">
              {msgLang === "en" ? "Responds in your language" : "Responde en tu idioma"}
            </p>
          </div>
        </div>
        <button
          onClick={clearChat}
          title={clearLabel}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-slate-800 ring-1 ring-emerald-500/30 mt-1">
                  <Image src="/logo.svg" alt="MI3.0" width={32} height={32} />
                </div>
              )}
              <div className={`flex flex-col gap-1 max-w-[82%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-emerald-500 text-white rounded-tr-sm"
                    : "bg-slate-800/80 text-slate-100 rounded-tl-sm border border-white/8"
                }`}>
                  <div className="space-y-0.5">{renderContent(msg.content)}</div>
                </div>
                <span className="text-[10px] text-slate-500 px-1">{formatTime(msg.ts)}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-slate-800 ring-1 ring-emerald-500/30 mt-1">
              <Image src="/logo.svg" alt="MI3.0" width={32} height={32} />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-slate-800/80 border border-white/8">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((j) => (
                  <motion.span
                    key={j}
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: j * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div className="px-4 pb-4 pt-3 border-t border-white/10 flex-shrink-0 bg-slate-900/60">
        <div className="flex gap-2 items-end bg-slate-800/60 rounded-2xl border border-white/10 px-4 py-2 focus-within:border-emerald-500/60 transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isTyping}
            rows={1}
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-sm resize-none outline-none py-1.5 leading-relaxed disabled:opacity-50"
            style={{ minHeight: "36px", maxHeight: "120px" }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20 mb-0.5"
          >
            {isTyping ? (
              <motion.div
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-[10px] text-slate-600 text-center mt-2">
          Powered by Claude · MI3.0 Mindbridge IA
        </p>
      </div>
    </div>
  );
}
