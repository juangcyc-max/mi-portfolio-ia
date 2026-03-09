"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage } from "@/types/chat";

// ============================================
// BASE DE CONOCIMIENTO - RESPUESTAS LOCALES (PRIORIDAD)
// ============================================

interface KnowledgeEntry {
  keywords: string[];
  response: string;
}

const knowledgeBase: Record<string, KnowledgeEntry> = {
  precio_web: {
    keywords: ["precio web", "cuánto cuesta página web", "coste sitio web", "tarifa desarrollo web", "presupuesto web", "web precio", "página web coste", "precios", "precio", "cuánto cuesta", "coste", "tarifa", "presupuesto", "valor", "inversión", "página web", "sitio web", "desarrollo web"],
    response: "En España, los precios de desarrollo web profesional en 2026 son:\n\n📊 Landing page: 600€ - 1.800€\n📊 Sitio corporativo: 1.500€ - 5.000€\n📊 Tienda online: 3.000€ - 12.000€\n📊 Portal complejo: desde 8.000€\n\nEstos rangos dependen de funcionalidades, diseño personalizado, SEO e integraciones. ¿Qué tipo de proyecto tienes en mente? Puedo ajustarte un presupuesto estimado."
  },
  precio_ia: {
    keywords: ["precio ia", "cuánto cuesta inteligencia artificial", "integración ia precio", "chatbot precio", "automatización coste", "ia tarifa", "asistente ia precio", "ia", "inteligencia artificial", "chatbot", "automatización", "agente ia"],
    response: "La integración de IA en España tiene estos rangos:\n\n🤖 Chatbots básicos: 800€ - 2.500€\n🤖 Asistentes con LLMs (GPT-4, Claude): 2.000€ - 8.000€\n🤖 Automatizaciones con agentes: 3.500€ - 15.000€\n\nLos proyectos suelen facturar entre 45€-85€/hora para desarrollo especializado. ¿Buscas automatizar atención al cliente, procesos internos o análisis de datos?"
  },
  precio_marketing: {
    keywords: ["precio marketing digital", "cuánto cuesta seo", "tarifa community manager", "precio redes sociales", "marketing online coste", "sem precio", "marketing", "seo", "sem", "redes sociales", "community manager"],
    response: "Servicios de marketing digital en España:\n\n📈 Gestión RRSS freelance: 20€-80€/hora o 300€-2.000€/mes por proyecto\n📈 SEO básico: 400€-1.200€/mes\n📈 Campañas SEM: desde 300€ + inversión en anuncios\n📈 Estrategia completa: 1.500€-5.000€/mes\n\nLos precios varían según experiencia y alcance. ¿Qué canal te interesa potenciar?"
  },
  tecnologias: {
    keywords: ["tecnologías", "stack", "qué usan", "next.js", "typescript", "tailwind", "supabase", "react", "tecnologias que usas", "tecnología", "tecnologias", "qué tecnología", "qué tecnologías", "qué stack", "con qué trabajas", "herramientas", "framework", "lenguaje"],
    response: "Trabajamos con un stack moderno y eficiente:\n\n🚀 Next.js 14: Framework de React para renderizado híbrido (SSR/SSG), rutas optimizadas y SEO superior.\n🚀 TypeScript: JavaScript con tipos estáticos para código más seguro y mantenible.\n🚀 Tailwind CSS: Framework utilitario para diseños rápidos y consistentes.\n🚀 Supabase: Backend open-source basado en PostgreSQL con auth, APIs instantáneas y tiempo real.\n\n¿Te interesa profundizar en alguna tecnología?"
  },
  como_funciona_ia: {
    keywords: ["cómo funciona la ia", "qué es un llm", "cómo integra ia", "inteligencia artificial explicación", "qué es gpt", "cómo funciona chatgpt", "explicación ia", "cómo funciona", "qué es", "llm", "gpt", "modelo de lenguaje"],
    response: "La IA que integramos funciona así:\n\n🧠 Los LLMs (Large Language Models) como GPT-4 o Claude son modelos entrenados con billones de datos que generan texto coherente.\n\n🔗 Los conectamos mediante APIs para:\n(1) Entender consultas en lenguaje natural\n(2) Procesar contexto de tu negocio\n(3) Generar respuestas útiles\n\n📚 Usamos técnicas como RAG (Retrieval-Augmented Generation) para que la IA acceda a tus documentos y datos específicos.\n\n¿Quieres ver un caso de uso aplicado a tu sector?"
  },
  disponibilidad: {
    keywords: ["disponibilidad", "cuándo empezamos", "tiempo entrega", "plazo proyecto", "agenda", "cuánto tardas", "fecha entrega", "disponible", "cuándo", "plazo", "tiempo", "duración", "semanas", "meses"],
    response: "Actualmente tengo disponibilidad para nuevos proyectos.\n\n⏱️ Tiempos estimados de entrega:\n• Landing page: 1-2 semanas\n• Sitio corporativo: 3-5 semanas\n• Integración IA básica: 2-3 semanas\n• Proyecto completo web+IA: 6-10 semanas\n\nLos plazos dependen de la complejidad y feedback. ¿Tienes una fecha límite o evento para lanzar?"
  },
  contacto: {
    keywords: ["contacto", "email", "llamar", "agenda", "hablar", "consultoría", "teléfono", "whatsapp", "contactar", "llamada", "reunión", "calendly", "correo", "teléfono"],
    response: "Puedes contactarme directamente:\n\n✉️ juan@mindbridge-ia.com\n📅 Agenda una llamada gratuita de 15 min\n💬 LinkedIn: Juan Gutiérrez de la Concha\n\nTambién puedes completar el formulario de esta página. ¿Prefieres que te envíe mi disponibilidad para esta semana?"
  },
  servicios: {
    keywords: ["servicios", "qué ofrecen", "qué hacen", "especialidades", "áreas", "en qué trabajas", "tus servicios", "servicio", "ofreces", "haces", "trabajas", "especialidad", "área"],
    response: "Ofrezco tres áreas especializadas:\n\n💻 Desarrollo Web Profesional: Sitios rápidos con Next.js, SEO optimizado, diseño responsive y escalable.\n\n🤖 Integración de IA: Chatbots, automatizaciones, análisis de datos con LLMs y visión artificial.\n\n⚡ Automatizaciones: Flujos de trabajo con agentes IA que ejecutan tareas repetitivas.\n\nTodo con enfoque en ROI medible. ¿En cuál te gustaría profundizar?"
  },
  hola: {
    keywords: ["hola", "buenas", "saludos", "hey", "buenos días", "buenas tardes", "hi", "hello", "buen día", "saludo"],
    response: "Buenas. Soy el asistente virtual de Mindbridge IA. Estoy aquí para resolver tus dudas sobre desarrollo web, integración de inteligencia artificial y marketing digital con datos reales del mercado español. ¿En qué puedo ayudarte hoy?"
  },
  gracias: {
    keywords: ["gracias", "thank", "agradecido", "muy bien", "perfecto", "entendido", "vale", "ok", "de acuerdo", "gracias"],
    response: "Es un placer ayudarte. Si necesitas más detalles, no dudes en preguntar. También puedes agendar una consulta gratuita de 15 minutos para evaluar tu proyecto sin compromiso. ¿Hay algo más en lo que pueda asistirte?"
  }
};

// ============================================
// DETECCIÓN DE INTENCIÓN - PRIORIDAD LOCAL
// ============================================

const detectIntent = (message: string): string | null => {
  const lower = message.toLowerCase().trim();
  console.log("🔍 Detectando intención para:", lower);
  
  for (const [intent, data] of Object.entries(knowledgeBase)) {
    const matched = data.keywords.find(keyword => lower.includes(keyword));
    if (matched) {
      console.log("✅ Intención detectada:", intent, "(keyword:", matched + ")");
      return intent;
    }
  }
  
  console.log("❌ No se detectó intención conocida");
  return null;
};

// Respuesta fallback inteligente
const getFallbackResponse = (userMessage: string): string => {
  console.log("🔄 Usando fallback para:", userMessage);
  
  const intent = detectIntent(userMessage);
  if (intent && knowledgeBase[intent]) {
    return knowledgeBase[intent].response;
  }
  
  // Fallback genérico profesional
  return "Entiendo tu consulta. Para ofrecerte una respuesta precisa y personalizada, me gustaría conectar contigo directamente. Puedo:\n\n(1) Agendar una llamada de 15 min gratuita\n(2) Enviarte un presupuesto estimado por email\n(3) Compartir casos de éxito similares a tu proyecto\n\n¿Qué opción prefieres?";
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Buenas. Soy el asistente virtual de Mindbridge IA. Estoy aquí para resolver tus dudas sobre desarrollo web, integración de inteligencia artificial y marketing digital con datos reales del mercado español. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isClient, setIsClient] = useState(false); // ✅ PARA HIDRATACIÓN
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ✅ Detectar cliente para evitar errores de hidratación
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cargar historial desde localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (e) {
        console.error("Error cargando historial:", e);
      }
    }
  }, []);

  // Guardar historial
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, isTyping]);

  // Simular escritura de IA (efecto realista)
  const simulateTyping = async (response: string): Promise<void> => {
    setIsTyping(true);
    const typingTime = Math.min(2500, Math.max(800, response.length * 12));
    await new Promise(resolve => setTimeout(resolve, typingTime));
    setIsTyping(false);
  };

  // Enviar mensaje - PRIORIDAD: Base de conocimiento local
  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input;
    
    if (!textToSend.trim() || loading) return;

    // Comando /clear
    if (textToSend.trim().toLowerCase() === "/clear") {
      clearChat();
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // ✅ PRIORIDAD: Usar base de conocimiento local PRIMERO
    const intent = detectIntent(textToSend);
    
    if (intent && knowledgeBase[intent]) {
      console.log("🎯 Usando respuesta local para:", intent);
      await simulateTyping(knowledgeBase[intent].response);
      
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: knowledgeBase[intent].response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
      return;
    }

    // Fallback: Intentar API externa solo si no hay match local
    try {
      console.log("🌐 Intentando API externa (fallback)...");
      const { chatRequest } = await import("@/lib/api");
      const response = await chatRequest({ message: textToSend });
      await simulateTyping(response.response);
      
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.log("⚠️ API externa no disponible, usando fallback local");
      await simulateTyping(getFallbackResponse(textToSend));
      
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: getFallbackResponse(textToSend),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Limpiar chat
  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Buenas. Soy el asistente virtual de Mindbridge IA. Estoy aquí para resolver tus dudas sobre desarrollo web, integración de inteligencia artificial y marketing digital con datos reales del mercado español. ¿En qué puedo ayudarte hoy?",
        timestamp: new Date()
      }
    ]);
    localStorage.removeItem("chatHistory");
  };

  // Enviar con Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Formatear hora
  const formatTime = (date: Date | undefined) => {
    if (!date) return "";
    return date.toLocaleTimeString("es-ES", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  return (
    <div 
      className="max-w-2xl mx-auto bg-white/15 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl border border-white/40 dark:border-slate-600/60 shadow-2xl flex flex-col h-[600px] sm:h-[680px] overflow-hidden"
      suppressHydrationWarning
    >
      
      {/* Header Profesional - Responsive */}
      <div className="p-3 sm:p-4 border-b border-white/30 dark:border-slate-600/50 bg-gradient-to-r from-slate-800/80 to-slate-900/80 dark:from-slate-900/90 dark:to-slate-800/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="size-9 sm:size-11 rounded-xl bg-gradient-to-br from-emerald-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 size-3 sm:size-3.5 rounded-full bg-emerald-500 border-2 border-slate-800 dark:border-slate-900"></div>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-white">Mindbridge Assistant</h3>
              <p className="text-[10px] sm:text-xs text-emerald-400 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-400"></span>
                Disponible ahora
              </p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="p-2 text-slate-400 hover:text-white dark:hover:text-white transition-colors rounded-lg hover:bg-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Nueva conversación"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Área de mensajes - Responsive height */}
      <div className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-4 sm:space-y-5 bg-gradient-to-b from-transparent via-slate-50/5 to-white/10 dark:via-slate-900/10 dark:to-slate-800/20">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              className={`flex gap-2 sm:gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {/* Avatar - Responsive */}
              <div className={`size-8 sm:size-9 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === "user" 
                  ? "bg-gradient-to-br from-slate-600 to-slate-700" 
                  : "bg-gradient-to-br from-emerald-600 to-cyan-500"
              }`}>
                {msg.role === "user" ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
              </div>

              {/* Burbuja de mensaje - Responsive */}
              <div className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[82%] ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}>
                <div className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md whitespace-pre-line break-words ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-emerald-600 to-cyan-600 text-white rounded-tr-md"
                    : "bg-white/95 dark:bg-slate-700/95 text-slate-800 dark:text-slate-100 rounded-tl-md border border-slate-200/50 dark:border-slate-600/50"
                }`}>
                  {msg.content}
                </div>
                <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 px-1">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Indicador de escritura profesional - Responsive */}
        {isClient && isTyping && (
          <AnimatePresence>
            <motion.div
              className="flex gap-2 sm:gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="size-8 sm:size-9 rounded-lg bg-gradient-to-br from-emerald-600 to-cyan-500 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="bg-white/95 dark:bg-slate-700/95 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl rounded-tl-md shadow-md border border-slate-200/50 dark:border-slate-600/50">
                <div className="flex gap-1.5 items-center">
                  <motion.span 
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                  />
                  <motion.span 
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.span 
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                  />
                  <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 ml-2">Escribiendo...</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Área de input profesional - Responsive */}
      <div className="p-3 sm:p-4 border-t border-white/30 dark:border-slate-600/50 bg-gradient-to-r from-slate-800/60 to-slate-900/60 dark:from-slate-900/80 dark:to-slate-800/80">
        <div className="relative">
          <textarea
            ref={inputRef}
            className="w-full bg-white/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-600 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 pr-12 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all shadow-sm min-h-[80px] sm:min-h-[96px]"
            placeholder="Escribe tu consulta..."
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading || isTyping}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || isTyping || !input.trim()}
            className="absolute right-2 bottom-2 sm:right-2.5 sm:bottom-2.5 p-2 sm:p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 text-white rounded-lg disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-600/30 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500">
            Enter para enviar • Shift+Enter para nueva línea
          </p>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-emerald-400">
            <span className="size-1.5 sm:size-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden sm:inline">Conectado</span>
          </div>
        </div>
      </div>
    </div>
  );
}