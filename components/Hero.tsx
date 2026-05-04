"use client";

import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, MicOff, Volume2, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

type AgentState = "idle" | "listening" | "thinking" | "speaking";

const GREETING =
  "Hola, soy MI3, el asistente de inteligencia artificial de Mindbridge IA. Estoy aquí para resolver tus dudas sobre nuestros servicios. ¿En qué puedo ayudarte?";

/* ── Hook de agente de voz ── */
function useVoiceAgent() {
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [message, setMessage] = useState(
    "Hola, soy MI3. Pulsa el micrófono para hablar conmigo."
  );
  const historyRef = useRef<{ role: string; content: string }[]>([]);
  const hasGreetedRef = useRef(false);
  const recognitionRef = useRef<any>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const sessionId = useRef(`voice-${Date.now()}`);

  useEffect(() => {
    const load = () => {
      voicesRef.current = window.speechSynthesis?.getVoices() ?? [];
    };
    load();
    window.speechSynthesis?.addEventListener("voiceschanged", load);
    return () =>
      window.speechSynthesis?.removeEventListener("voiceschanged", load);
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "es-ES";
    utter.rate = 1.05;
    utter.pitch = 1.0;
    const voices = voicesRef.current;
    const esVoice =
      voices.find((v) => v.lang === "es-ES" && v.name.includes("Google")) ||
      voices.find((v) => v.lang === "es-ES") ||
      voices.find((v) => v.lang.startsWith("es"));
    if (esVoice) utter.voice = esVoice;
    setAgentState("speaking");
    utter.onend = () => setAgentState("idle");
    utter.onerror = () => setAgentState("idle");
    window.speechSynthesis.speak(utter);
  }, []);

  const greet = useCallback(() => {
    if (hasGreetedRef.current) return;
    hasGreetedRef.current = true;
    historyRef.current = [{ role: "assistant", content: GREETING }];
    setMessage(GREETING);
    speak(GREETING);
  }, [speak]);

  const sendMessage = useCallback(
    async (userText: string) => {
      setMessage(`Tú: "${userText}"`);
      setAgentState("thinking");
      const newHistory = [
        ...historyRef.current,
        { role: "user", content: userText },
      ];
      historyRef.current = newHistory;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newHistory,
            sessionId: sessionId.current,
          }),
        });
        const data = await res.json();
        const reply =
          data.text || "Lo siento, no pude procesar tu pregunta. Inténtalo de nuevo.";
        historyRef.current = [
          ...historyRef.current,
          { role: "assistant", content: reply },
        ];
        setMessage(reply);
        speak(reply);
      } catch {
        setAgentState("idle");
        setMessage("Error de conexión. Por favor, inténtalo de nuevo.");
      }
    },
    [speak]
  );

  const startListening = useCallback(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      setMessage(
        "Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge."
      );
      return;
    }
    window.speechSynthesis?.cancel();
    const rec = new SR();
    rec.lang = "es-ES";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => setAgentState("listening");
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      sendMessage(text);
    };
    rec.onerror = () => setAgentState("idle");
    rec.onend = () =>
      setAgentState((s) => (s === "listening" ? "idle" : s));
    recognitionRef.current = rec;
    rec.start();
  }, [sendMessage]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setAgentState("idle");
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setAgentState("idle");
  }, []);

  return { agentState, message, greet, startListening, stopListening, stopSpeaking };
}

/* ── Componente principal ── */
export default function Hero() {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const { agentState, message, greet, startListening, stopListening, stopSpeaking } =
    useVoiceAgent();

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(greet, 1800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isSpeaking = agentState === "speaking";
  const isListening = agentState === "listening";
  const isThinking = agentState === "thinking";

  return (
    <section
      className="relative pt-20 sm:pt-24 md:pt-32 pb-20 sm:pb-24 md:pb-32 overflow-hidden bg-transparent"
      suppressHydrationWarning
    >
      {/* Glow Background */}
      <div className="absolute inset-0 -z-10 opacity-20 sm:opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500 rounded-full blur-[100px] sm:blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-400 rounded-full blur-[100px] sm:blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">

          {/* LEFT SIDE */}
          <motion.div
            className="flex flex-col gap-6 sm:gap-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Availability Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider w-fit"
              variants={fadeInUp}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              {t("hero_available")}
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-lg"
              variants={fadeInUp}
            >
              MINDBRIDGE{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500 drop-shadow-sm">
                IA
              </span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl"
              variants={fadeInUp}
            >
              {t("hero_subtitle")}
            </motion.p>

            {/* Bio Card */}
            <motion.div
              className="bg-white/60 dark:bg-white/[0.03] backdrop-blur-2xl p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-4 sm:gap-6 border border-slate-200/50 dark:border-white/10 shadow-lg dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:bg-white/80 dark:hover:bg-white/[0.06] transition-colors duration-500 group"
              variants={fadeInUp}
            >
              <div className="size-20 sm:size-24 rounded-full overflow-hidden shrink-0 bg-emerald-500/10 dark:bg-white/5 border border-emerald-500/20 dark:border-white/10 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-500">
                <Image
                  src="/logo.svg"
                  alt="Juan Gutiérrez"
                  width={72}
                  height={72}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white drop-shadow-sm">
                  Juan Gutiérrez de la Concha
                </h3>
                <p className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
                  {t("hero_role")}
                </p>
                <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {t("hero_bio")}
                </p>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 w-full sm:w-auto"
              variants={fadeInUp}
            >
              <Link
                href="#demo"
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-black text-sm sm:text-base transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 border border-emerald-400/50 text-center min-h-[48px] flex items-center justify-center"
              >
                {t("hero_cta_primary")}
              </Link>
              <Link
                href="#planes"
                className="w-full sm:w-auto bg-emerald-500/10 dark:bg-white/[0.03] backdrop-blur-2xl px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-emerald-700 dark:text-white border border-emerald-500/20 dark:border-white/10 hover:bg-emerald-500/20 dark:hover:bg-white/[0.1] hover:border-emerald-500/40 dark:hover:border-white/20 transition-all duration-300 text-sm sm:text-base text-center min-h-[48px] flex items-center justify-center shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]"
              >
                {t("hero_cta_secondary")}
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE — Agente de voz */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-2xl blur opacity-20 sm:opacity-30 group-hover:opacity-40 transition duration-1000" />

            <div className="relative bg-white/60 dark:bg-white/[0.03] backdrop-blur-2xl rounded-2xl overflow-hidden shadow-lg dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-slate-200/50 dark:border-white/10 flex flex-col items-center justify-center gap-6 p-8 sm:p-10 min-h-[340px]">

              {/* Logo con pulso al hablar */}
              <div className="relative">
                <AnimatePresence>
                  {isClient && isSpeaking && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-emerald-500/40 to-cyan-400/40 rounded-full blur-2xl"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1.4 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
                <motion.div
                  className="size-28 sm:size-36 rounded-full bg-emerald-500/10 dark:bg-white/5 border border-emerald-500/20 dark:border-white/10 flex items-center justify-center p-5"
                  animate={
                    isSpeaking
                      ? { opacity: [1, 0.75, 1], borderColor: ["rgba(16,185,129,0.2)", "rgba(16,185,129,0.6)", "rgba(16,185,129,0.2)"] }
                      : isListening
                      ? { opacity: [1, 0.8, 1], borderColor: ["rgba(239,68,68,0.3)", "rgba(239,68,68,0.7)", "rgba(239,68,68,0.3)"] }
                      : {}
                  }
                  transition={
                    isSpeaking || isListening
                      ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
                      : {}
                  }
                >
                  <Image
                    src="/logo.svg"
                    alt="MI3 Agente IA"
                    width={100}
                    height={100}
                    className="object-contain drop-shadow-lg"
                    priority
                  />
                </motion.div>
              </div>

              {/* Nombre e identificación */}
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-1">
                  MI3 · Asistente IA
                </p>

                {/* Waveform al hablar */}
                {isClient && isSpeaking && (
                  <motion.div
                    className="flex items-center justify-center gap-1 my-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[...Array(7)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="w-1 bg-gradient-to-t from-emerald-400 to-cyan-300 rounded-full"
                        animate={{ height: [4, 16, 4] }}
                        transition={{
                          duration: 1.0,
                          repeat: Infinity,
                          delay: i * 0.12,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </motion.div>
                )}

                {/* Waveform al escuchar */}
                {isClient && isListening && (
                  <motion.div
                    className="flex items-center justify-center gap-1 my-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[...Array(7)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="w-1 bg-gradient-to-t from-red-400 to-red-300 rounded-full"
                        animate={{ height: [4, 12, 4] }}
                        transition={{
                          duration: 0.9,
                          repeat: Infinity,
                          delay: i * 0.1,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Burbuja de mensaje */}
              <motion.div
                key={message}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 dark:bg-slate-800/60 rounded-2xl px-5 py-4 text-sm text-slate-700 dark:text-slate-200 text-center leading-relaxed border border-slate-200/60 dark:border-white/10 max-w-xs shadow-sm"
              >
                {isThinking ? (
                  <span className="flex items-center justify-center gap-2 text-slate-400">
                    <Loader2 size={14} className="animate-spin" />
                    Procesando...
                  </span>
                ) : (
                  message
                )}
              </motion.div>

              {/* Botón de control */}
              <div className="flex flex-col items-center gap-2">
                {agentState === "idle" && (
                  <motion.button
                    onClick={startListening}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-colors"
                    title="Hablar con MI3"
                  >
                    <Mic size={22} />
                  </motion.button>
                )}

                {agentState === "listening" && (
                  <motion.button
                    onClick={stopListening}
                    whileTap={{ scale: 0.94 }}
                    className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/30 transition-colors"
                    title="Dejar de escuchar"
                  >
                    <MicOff size={22} />
                  </motion.button>
                )}

                {agentState === "thinking" && (
                  <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    <Loader2 size={22} className="animate-spin text-emerald-500" />
                  </div>
                )}

                {agentState === "speaking" && (
                  <motion.button
                    onClick={stopSpeaking}
                    whileTap={{ scale: 0.94 }}
                    className="w-14 h-14 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 transition-colors"
                    title="Interrumpir"
                  >
                    <Volume2 size={22} />
                  </motion.button>
                )}

                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  {agentState === "idle" && "Pulsa para hablar"}
                  {agentState === "listening" && "Escuchando..."}
                  {agentState === "thinking" && "Procesando..."}
                  {agentState === "speaking" && "Pulsa para interrumpir"}
                </p>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
