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
        .from("contacts")
        .insert({
          name: contactName,
          email: contactEmail,
          message: contactMessage
        });

      if (error) throw error;

      setContactSent(true);
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      
      setTimeout(() => setContactSent(false), 5000);
    } catch (error: any) {
      console.error("Error enviando contacto:", error.message);
      alert("Error al enviar. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24" id="contacto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Left Column: Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h3 className="text-4xl font-black dark:text-white mb-6">
              ¿Tienes un proyecto en mente?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Estamos listos para ayudarte a integrar la IA en tu negocio y construir la plataforma web que necesitas. Cuéntanos más sobre tus objetivos.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <span>✉️</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Escríbenos</p>
                  <p className="font-bold dark:text-white">contacto@mindbridge.ia</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400">
                  <span>📍</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Ubicación</p>
                  <p className="font-bold dark:text-white">Madrid, España</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div 
            className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-md p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {contactSent ? (
              <motion.div 
                className="p-4 bg-emerald-500/20 text-emerald-400 rounded-lg mb-4 border border-emerald-500/30 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                ✅ Mensaje enviado correctamente. Te responderé pronto.
              </motion.div>
            ) : (
              <form onSubmit={sendContact} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-emerald-500 focus:border-emerald-500 dark:text-white"
                      placeholder="Tu nombre"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-emerald-500 focus:border-emerald-500 dark:text-white"
                      placeholder="tu@email.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-emerald-500 focus:border-emerald-500 dark:text-white min-h-[120px]"
                    placeholder="¿Cómo podemos ayudarte?"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    required
                    disabled={submitting}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Enviando..." : "Enviar Mensaje"}
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}