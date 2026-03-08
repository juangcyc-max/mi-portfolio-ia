"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChatMessage } from "@/types/chat";
import { chatRequest } from "@/lib/api";

export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hola, soy el asistente de Mindbridge IA. ¿En qué puedo ayudarte hoy con tu proyecto tecnológico?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enviar mensaje
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date()
    };

    // Añadir mensaje del usuario
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await chatRequest({ message: input });
      
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error en chat:", error);
      
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Lo siento, tuve un error. Por favor intenta de nuevo.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Enviar con Enter (sin Shift)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white/5 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-[600px]">
      
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <div className="size-3 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-sm font-bold dark:text-white">Mindbridge Assistant v1.0</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            className={`flex gap-3 max-w-[80%] ${
              msg.role === "user" ? "ml-auto flex-row-reverse" : ""
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Avatar */}
            <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === "user" 
                ? "bg-cyan-500" 
                : "bg-emerald-500"
            }`}>
              <span className="text-white text-sm">
                {msg.role === "user" ? "👤" : "🤖"}
              </span>
            </div>

            {/* Message Bubble */}
            <div className={`p-3 rounded-2xl text-sm ${
              msg.role === "user"
                ? "bg-emerald-500 text-white rounded-tr-none"
                : "bg-slate-200 dark:bg-slate-700 dark:text-slate-300 rounded-tl-none"
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <motion.div
            className="flex gap-3 max-w-[80%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="size-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <span className="text-white text-sm">🤖</span>
            </div>
            <div className="bg-slate-200 dark:bg-slate-700 p-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="relative">
          <textarea
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-emerald-500 focus:border-emerald-500 resize-none pr-12 dark:text-white placeholder-slate-500"
            placeholder="Escribe tu pregunta aquí..."
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-500 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ➤
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          Presiona Enter para enviar, Shift + Enter para nueva línea
        </p>
      </div>
    </div>
  );
}