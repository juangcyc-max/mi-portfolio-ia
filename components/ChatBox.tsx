"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function makeGreeting(text: string): Message {
  return { role: "assistant", content: text, timestamp: new Date() };
}

export default function ChatBox() {
  const { t, lang } = useTranslation();

  const [messages, setMessages] = useState<Message[]>(() => [
    makeGreeting(t("chat_greeting")),
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Update greeting when language changes
  useEffect(() => {
    setMessages([makeGreeting(t("chat_greeting"))]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const clearChat = useCallback(() => {
    abortRef.current?.abort();
    setMessages([makeGreeting(t("chat_greeting"))]);
    setIsStreaming(false);
  }, [t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  };

  const simulateStream = async (text: string, history: Message[]) => {
    const words = text.split(" ");
    let out = "";
    for (let i = 0; i < words.length; i++) {
      out += (i === 0 ? "" : " ") + words[i];
      const snapshot = out;
      setMessages([
        ...history,
        { role: "assistant", content: snapshot, timestamp: new Date() },
      ]);
      await new Promise((r) => setTimeout(r, 35 + Math.random() * 55));
    }
    setIsStreaming(false);
  };

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMsg: Message = { role: "user", content: text, timestamp: new Date() };

    // Full history including the new user message
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsStreaming(true);

    // Show typing placeholder
    setMessages([...updatedHistory, { role: "assistant", content: "", timestamp: new Date() }]);

    try {
      const controller = new AbortController();
      abortRef.current = controller;

      // Only send actual conversation messages (skip any leading assistant greeting)
      const apiMessages = updatedHistory
        .filter((m, i) => !(i === 0 && m.role === "assistant"))
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
        signal: controller.signal,
      });

      // Demo fallback when no API key
      if (res.headers.get("content-type")?.includes("application/json")) {
        const json = await res.json();
        if (json.demo || json.error) {
          await simulateStream(
            "Hola 👋 Soy **MI3.0**. En este momento el servicio de IA no está disponible. Por favor contacta directamente a juangcyc@gmail.com o usa el formulario de contacto.",
            updatedHistory
          );
          return;
        }
      }

      if (!res.ok || !res.body) throw new Error("Stream unavailable");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;

        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            ...next[next.length - 1],
            content: accumulated,
          };
          return next;
        });
      }

      // If stream returned empty, show a fallback
      if (!accumulated.trim()) {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            ...next[next.length - 1],
            content: "Lo siento, no pude procesar tu mensaje. ¿Puedes intentarlo de nuevo?",
          };
          return next;
        });
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      await simulateStream(
        "Parece que hay un problema de conexión. Por favor revisa tu conexión e inténtalo de nuevo, o contáctanos directamente en juangcyc@gmail.com.",
        updatedHistory
      );
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages, t]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const renderContent = (content: string) => {
    if (!content) return null;
    const lines = content.split("\n");
    return lines.map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      const rendered = parts.map((part, j) =>
        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
      );
      const isBullet = line.startsWith("• ") || line.startsWith("- ");
      if (isBullet) {
        return (
          <div key={i} className="flex gap-2">
            <span className="text-emerald-400 flex-shrink-0">•</span>
            <span>{rendered}</span>
          </div>
        );
      }
      return (
        <span key={i}>
          {rendered}
          {i < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[680px] sm:h-[700px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/80 backdrop-blur-xl">

      {/* ── Header ── */}
      <div className="px-5 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-emerald-500/40 bg-slate-800">
              <Image src="/logo.svg" alt="MI3.0" width={40} height={40} />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">{t("chat_title")}</p>
            <p className="text-xs text-emerald-400 font-medium">{t("chat_subtitle")}</p>
          </div>
        </div>

        <button
          onClick={clearChat}
          title={t("chat_clear")}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-slate-800 ring-1 ring-emerald-500/30 mt-1">
                  <Image src="/logo.svg" alt="MI3.0" width={32} height={32} />
                </div>
              )}

              <div className={`flex flex-col gap-1 max-w-[82%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-emerald-500 text-white rounded-tr-sm"
                      : "bg-white/8 text-slate-100 rounded-tl-sm border border-white/10"
                  }`}
                >
                  {msg.role === "assistant" && i === messages.length - 1 && isStreaming && !msg.content ? (
                    <div className="flex gap-1 items-center py-1">
                      {[0, 1, 2].map((j) => (
                        <motion.span
                          key={j}
                          className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: j * 0.15 }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-0.5">{renderContent(msg.content)}</div>
                  )}

                  {msg.role === "assistant" && i === messages.length - 1 && isStreaming && msg.content && (
                    <motion.span
                      className="inline-block w-0.5 h-4 bg-emerald-400 ml-0.5 align-middle"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </div>
                <span className="text-[10px] text-slate-500 px-1">{formatTime(msg.timestamp)}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <div className="px-4 pb-4 pt-3 border-t border-white/10 flex-shrink-0 bg-slate-900/50">
        <div className="flex gap-2 items-end bg-white/5 rounded-2xl border border-white/10 px-4 py-2 focus-within:border-emerald-500/50 transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={t("chat_placeholder")}
            disabled={isStreaming}
            rows={1}
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-sm resize-none outline-none py-1.5 leading-relaxed disabled:opacity-50"
            style={{ minHeight: "36px", maxHeight: "120px" }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            className="flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20 mb-0.5"
          >
            {isStreaming ? (
              <motion.div
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-[10px] text-slate-600 text-center mt-2">
          Powered by Claude · {t("chat_subtitle")}
        </p>
      </div>
    </div>
  );
}
