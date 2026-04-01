"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* =========================
   TIPOS
========================= */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

/* =========================
   PRECIOS (IGUAL QUE CALCULADORA)
========================= */

// Precios alineados con sección Planes y BudgetCalculator
const projectPrices = {
  landing: { min: 990, max: 1990, monthly: 79 },
  corporativa: { min: 2490, max: 4490, monthly: 149 },
  tienda: { min: 3500, max: 7990, monthly: 149 },
  ia: { min: 4990, max: 12000, monthly: 299 }
};

const extras = {
  seo: 400,
  chatbot: 600,
  analytics: 300,
  cms: 500,
  idioma: 450,
  ia_avanzada: 1000
};

/* =========================
   COMPONENTE
========================= */

export default function ChatBox() {

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hola 👋 Soy el asistente de Mindbridge IA.\n\n¿Quieres crear una landing page, web corporativa, tienda online o integrar IA?",
      timestamp: new Date()
    }
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  const [conversationStep, setConversationStep] =
    useState<"project" | "extras" | "final">("project");

  const [selectedProject, setSelectedProject] =
    useState<keyof typeof projectPrices | null>(null);

  const [total, setTotal] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* =========================
     SCROLL
  ========================= */

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth"
      });
    }, 100);
  };

  useEffect(scrollToBottom, [messages]);

  /* =========================
     LOCAL STORAGE
  ========================= */

  useEffect(() => {

    const saved = localStorage.getItem("chatHistory");

    if (saved) {

      const parsed = JSON.parse(saved);

      const withDates = parsed.map((msg:any)=>({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));

      setMessages(withDates);

    }

  },[]);

  useEffect(()=>{

    if(messages.length>1){
      localStorage.setItem("chatHistory",JSON.stringify(messages));
    }

  },[messages]);

  /* =========================
     STREAMING
  ========================= */

  const streamMessage = async (text:string)=>{

    setIsTyping(true);

    let output = "";

    const words = text.split(" ");

    for (let i=0;i<words.length;i++){

      output += (i===0 ? "" : " ") + words[i];

      setMessages(prev=>{

        const last = prev[prev.length-1];

        if(last?.role==="assistant"){

          const updated = [...prev];
          updated[updated.length-1] = {
            ...last,
            content: output
          };

          return updated;
        }

        return [
          ...prev,
          {
            role:"assistant",
            content:output,
            timestamp:new Date()
          }
        ];
      });

      await new Promise(r=>setTimeout(r,40+Math.random()*80));
    }

    setIsTyping(false);
  };

  /* =========================
     REINICIAR CHAT
  ========================= */

  const clearChat = () => {

    setMessages([
      {
        role: "assistant",
        content:
          "Hola 👋 Soy el asistente de Mindbridge IA.\n\n¿Quieres crear una landing page, web corporativa, tienda online o integrar IA?",
        timestamp: new Date()
      }
    ]);

    setConversationStep("project");
    setSelectedProject(null);
    setTotal(0);

    localStorage.removeItem("chatHistory");
  };

  /* =========================
     ENVIAR MENSAJE
  ========================= */

  const sendMessage = async () => {

    if(!input.trim() || loading) return;

    const text = input.toLowerCase();

    setMessages(prev=>[
      ...prev,
      {
        role:"user",
        content:input,
        timestamp:new Date()
      }
    ]);

    setInput("");
    setLoading(true);

    /* =====================
       PASO 1 PROYECTO
    ===================== */

    if(conversationStep==="project"){

      if(text.includes("landing")){

        const price = projectPrices.landing;

        setSelectedProject("landing");
        setTotal(price.min);

        await streamMessage(
          `Perfecto 👍\n\nUna **Landing Page** tiene un coste de implementación entre **${price.min}€ y ${price.max}€** + cuota de mantenimiento mensual de **${price.monthly}€/mes** (incluye alojamiento, IA básica y soporte).\n\n¿Quieres añadir funcionalidades como SEO, chatbot o CMS?`
        );

        setConversationStep("extras");
        setLoading(false);
        return;
      }

      if(text.includes("corporativa")){

        const price = projectPrices.corporativa;

        setSelectedProject("corporativa");
        setTotal(price.min);

        await streamMessage(
          `Perfecto 👍\n\nUna **Web Corporativa** tiene un coste de implementación entre **${price.min}€ y ${price.max}€** + cuota mensual de **${price.monthly}€/mes** (cloud, automatizaciones básicas, IA y mantenimiento incluidos).\n\nMuchas empresas añaden CMS o SEO.`
        );

        setConversationStep("extras");
        setLoading(false);
        return;
      }

      if(text.includes("tienda")){

        const price = projectPrices.tienda;

        setSelectedProject("tienda");
        setTotal(price.min);

        await streamMessage(
          `Perfecto 👍\n\nUna **Tienda Online** tiene un coste de implementación entre **${price.min}€ y ${price.max}€** + cuota mensual de **${price.monthly}€/mes** (alojamiento, mantenimiento e IA integrada incluidos).\n\nPodemos añadir analytics, multi-idioma o chatbot.`
        );

        setConversationStep("extras");
        setLoading(false);
        return;
      }

      if(text.includes("ia")){

        const price = projectPrices.ia;

        setSelectedProject("ia");
        setTotal(price.min);

        await streamMessage(
          `Perfecto 👍\n\nUna **solución con IA integrada** tiene un coste de implementación entre **${price.min}€ y ${price.max}€** + cuota mensual de **${price.monthly}€/mes** (infraestructura cloud, automatizaciones avanzadas e IA en puntos clave incluidos).\n\nPodemos añadir IA avanzada, chatbot u otras integraciones.`
        );

        setConversationStep("extras");
        setLoading(false);
        return;
      }

      await streamMessage(
        "Para poder ayudarte mejor necesito saber el tipo de proyecto:\n\n• Landing Page\n• Web Corporativa\n• Tienda Online\n• Integración IA"
      );

      setLoading(false);
      return;
    }

    /* =====================
       PASO 2 EXTRAS
    ===================== */

    if(conversationStep==="extras"){

      let added = [];

      if(text.includes("seo")){
        setTotal(t=>t+extras.seo);
        added.push("SEO (+400€)");
      }

      if(text.includes("chatbot")){
        setTotal(t=>t+extras.chatbot);
        added.push("Chatbot IA (+600€)");
      }

      if(text.includes("analytics")){
        setTotal(t=>t+extras.analytics);
        added.push("Analytics (+300€)");
      }

      if(text.includes("cms")){
        setTotal(t=>t+extras.cms);
        added.push("CMS (+500€)");
      }

      if(text.includes("idioma")){
        setTotal(t=>t+extras.idioma);
        added.push("Multi-idioma (+450€)");
      }

      if(text.includes("ia avanzada")){
        setTotal(t=>t+extras.ia_avanzada);
        added.push("IA avanzada (+1000€)");
      }

      if(added.length===0){

        await streamMessage(
          "Puedes añadir extras como:\n\nSEO\nChatbot IA\nAnalytics\nCMS\nMulti-idioma\nIA avanzada\n\n¿Quieres alguno?"
        );

        setLoading(false);
        return;
      }

      await streamMessage(
        `Perfecto 👍 añadimos:\n\n${added.join("\n")}\n\n¿Quieres que te calcule el presupuesto aproximado?`
      );

      setConversationStep("final");
      setLoading(false);
      return;
    }

    /* =====================
       PASO FINAL
    ===================== */

    if(conversationStep==="final"){

      const monthly = selectedProject ? projectPrices[selectedProject].monthly : null;
      const monthlyText = monthly ? `\n + **${monthly}€/mes** de mantenimiento (cloud + IA + soporte incluidos).` : "";
      await streamMessage(
        `El presupuesto aproximado para tu proyecto sería desde **${total}€** de implementación.${monthlyText}\n\nSi quieres puedo prepararte una propuesta detallada o agendar una llamada de 15 minutos.`
      );

      setLoading(false);
      return;
    }

  };

  const handleKeyDown = (e:React.KeyboardEvent<HTMLTextAreaElement>)=>{
    if(e.key==="Enter" && !e.shiftKey){
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date?:Date)=>{
    if(!date) return "";
    return date.toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"});
  };

  /* =========================
     UI MEJORADA
  ========================= */

  return (
    <div className="max-w-2xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col h-[700px] overflow-hidden font-sans">
      
      {/* HEADER */}
      <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-3">
          
          {/* AVATAR CON EL LOGO */}
          <div className="relative">
            <div className="w-11 h-11 bg-slate-800/50 rounded-full flex items-center justify-center shadow-lg border border-white/10 overflow-hidden p-1.5">
              <img 
                src="/logo.svg" 
                alt="Mindbridge IA Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
          </div>

          <div>
            <h3 className="font-semibold text-white tracking-wide">Mindbridge Assistant</h3>
            <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              En línea
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-2.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          title="Reiniciar chat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* CHAT BODY */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 text-sm leading-relaxed whitespace-pre-line shadow-md relative ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl rounded-tr-sm"
                    : "bg-white text-slate-700 rounded-2xl rounded-tl-sm border border-slate-100"
                }`}
              >
                {msg.content}

                <div
                  className={`text-[10px] mt-2 ${
                    msg.role === "user"
                      ? "text-emerald-100/80 text-right"
                      : "text-slate-400 text-left"
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* TYPING INDICATOR */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/90 backdrop-blur rounded-2xl rounded-tl-sm py-3 px-4 shadow-sm border border-slate-100 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-white/5 border-t border-white/10 backdrop-blur-md">
        <div className="relative flex items-end gap-2">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje..."
            className="w-full bg-slate-800/60 border border-white/10 rounded-2xl py-3.5 pl-4 pr-12 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none shadow-inner"
            style={{ minHeight: '52px', maxHeight: '120px' }}
          />
          
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className={`absolute right-2 bottom-1.5 p-2 rounded-xl flex items-center justify-center transition-all duration-200 ${
              !input.trim() || loading
                ? "text-slate-500 bg-transparent"
                : "text-white bg-emerald-500 hover:bg-emerald-600 shadow-md transform hover:scale-105"
            }`}
          >
            <svg className="w-4 h-4 translate-x-0.5 translate-y-px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <div className="text-center mt-2 opacity-50">
          <span className="text-[10px] text-slate-300 tracking-wide">
            Presiona <strong className="font-semibold">Enter</strong> para enviar
          </span>
        </div>
      </div>

    </div>
  );
}