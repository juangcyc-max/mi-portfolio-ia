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

  const sendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactName || !contactEmail || !contactMessage) {
      alert("Por favor completa todos los campos");
      return;
    }

    // Verificar si Supabase está configurado
    if (!isSupabaseConfigured()) {
      console.warn("Supabase no configurado, usando modo demo");
      setContactSent(true);
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      setTimeout(() => setContactSent(false), 5000);
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([
          {
            name: contactName,
            email: contactEmail,
            message: contactMessage,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setContactSent(true);
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      setTimeout(() => setContactSent(false), 5000);
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      alert("Hubo un error al enviar tu mensaje. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="relative py-24 overflow-hidden">
      {/* Glow Background */}
      <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400 rounded-full blur-[140px]"></div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            ¿Listo para <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-400">empezar</span>?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Cuéntame sobre tu proyecto y te contacto en menos de 24 horas.
          </p>
        </motion.div>

        {/* Form Container - MÁS TRANSPARENTE */}
        <motion.div 
          className="bg-white/10 dark:bg-slate-900/30 backdrop-blur-sm p-8 rounded-2xl border border-white/30 dark:border-slate-700/50 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {contactSent ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                ¡Mensaje enviado!
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Te contacto muy pronto. Gracias por confiar en Mindbridge IA.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={sendContact} className="space-y-6">
              
              {/* Name */}
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-white/20 dark:bg-slate-900/50 border border-white/30 dark:border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:ring-emerald-500 focus:border-emerald-500 dark:text-white placeholder-slate-500 transition-colors"
                  placeholder="Tu nombre"
                  required
                  disabled={submitting}
                />
              </motion.div>

              {/* Email */}
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-white/20 dark:bg-slate-900/50 border border-white/30 dark:border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:ring-emerald-500 focus:border-emerald-500 dark:text-white placeholder-slate-500 transition-colors"
                  placeholder="tu@email.com"
                  required
                  disabled={submitting}
                />
              </motion.div>

              {/* Message */}
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Mensaje *
                </label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full bg-white/20 dark:bg-slate-900/50 border border-white/30 dark:border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:ring-emerald-500 focus:border-emerald-500 dark:text-white placeholder-slate-500 resize-none transition-colors"
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
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Enviando...
                    </>
                  ) : (
                    "Enviar Mensaje"
                  )}
                </button>
              </motion.div>

              {/* Privacy Note */}
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                Tus datos están protegidos. No comparto información con terceros.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}