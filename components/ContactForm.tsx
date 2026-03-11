"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export default function ContactForm() {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSent, setContactSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const sendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactName || !contactEmail || !contactMessage) {
      setError("Por favor completa todos los campos");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // ✅ ENVIAR EMAIL CON RESEND (prioridad)
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
          budget: undefined,
          projectType: undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al enviar el mensaje");
      }

      // ✅ Éxito: mostrar confirmación
      setContactSent(true);
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      
      // ✅ BACKUP: Guardar en Supabase (opcional)
      if (isSupabaseConfigured()) {
        await supabase.from("contact_messages").insert([
          {
            name: contactName,
            email: contactEmail,
            message: contactMessage,
            created_at: new Date().toISOString()
          }
        ]);
      }

      setTimeout(() => setContactSent(false), 5000);
      
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      setError(error instanceof Error ? error.message : "Hubo un error. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section 
      id="contacto" 
      className="relative py-12 sm:py-16 md:py-24 px-4 overflow-hidden"
      suppressHydrationWarning
    >
      {/* Glow Background */}
      <div className="absolute inset-0 -z-10 opacity-15 sm:opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-500 rounded-full blur-[80px] sm:blur-[140px]"></div>
        <div className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-400 rounded-full blur-[80px] sm:blur-[140px]"></div>
      </div>

      <div className="max-w-3xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-8 sm:mb-10 md:mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4 px-2 leading-tight">
            ¿Listo para{" "}
            {/* ✅ GRADIENTE VERDE SOLO (sin cyan) */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">
              empezar
            </span>
            ?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-2">
            Cuéntame sobre tu proyecto y te contacto en menos de 24 horas.
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div 
          className="bg-white/10 dark:bg-slate-900/30 backdrop-blur-sm p-5 sm:p-6 md:p-8 rounded-2xl border border-white/30 dark:border-slate-700/50 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {contactSent ? (
            <motion.div 
              className="text-center py-8 sm:py-10 md:py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {/* ✅ Icono SVG profesional */}
              <div className="mb-4 sm:mb-6 flex justify-center">
                <svg 
                  className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                ¡Mensaje enviado!
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 px-2">
                Te contacto muy pronto. Gracias por confiar en Mindbridge IA.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={sendContact} className="space-y-5 sm:space-y-6">
              
              {/* Mensaje de error */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}
              
              {/* Name */}
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-white/20 dark:bg-slate-900/50 border border-white/30 dark:border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 dark:text-white placeholder-slate-500 transition-colors min-h-[48px]"
                  placeholder="Tu nombre"
                  required
                  disabled={submitting}
                  autoCapitalize="words"
                />
              </motion.div>

              {/* Email */}
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-white/20 dark:bg-slate-900/50 border border-white/30 dark:border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 dark:text-white placeholder-slate-500 transition-colors min-h-[48px]"
                  placeholder="tu@email.com"
                  required
                  disabled={submitting}
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </motion.div>

              {/* Message */}
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Mensaje *
                </label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full bg-white/20 dark:bg-slate-900/50 border border-white/30 dark:border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 dark:text-white placeholder-slate-500 resize-none transition-colors min-h-[120px] sm:min-h-[140px]"
                  placeholder="Cuéntame sobre tu proyecto..."
                  rows={5}
                  required
                  disabled={submitting}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-bold py-3 sm:py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/30 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px] text-sm sm:text-base"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span className="hidden sm:inline">Enviando...</span>
                      <span className="sm:hidden">Enviando</span>
                    </>
                  ) : (
                    "Enviar Mensaje"
                  )}
                </button>
              </motion.div>

              {/* Privacy Note */}
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 text-center px-4">
                Tus datos están protegidos. No comparto información con terceros.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}