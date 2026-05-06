"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const PROJECT_TYPES = [
  "Web corporativa",
  "E-commerce / Tienda online",
  "SaaS / Dashboard",
  "App móvil",
  "Automatización con IA",
  "Otro",
];

const BUDGETS = [
  "Menos de 1.000€",
  "1.000€ – 3.000€",
  "3.000€ – 6.000€",
  "Más de 6.000€",
  "Aún no lo sé",
];

export default function ContactForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", projectType: "", budget: "", message: "",
  });
  const [contactSent, setContactSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const sendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError(t("contact_error_required"));
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Error al enviar");

      setContactSent(true);
      setForm({ name: "", email: "", phone: "", projectType: "", budget: "", message: "" });

      if (isSupabaseConfigured()) {
        await supabase.from("contact_messages").insert([{
          name: form.name, email: form.email, message: form.message, created_at: new Date().toISOString(),
        }]);
      }
      setTimeout(() => setContactSent(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hubo un error. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full bg-white/20 dark:bg-slate-900/50 border border-white/30 dark:border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 dark:text-white placeholder-slate-500 transition-colors min-h-[48px]";
  const selectClass = inputClass + " cursor-pointer";

  return (
    <section id="contacto" className="relative py-12 sm:py-16 md:py-24 px-4 overflow-hidden" suppressHydrationWarning>
      <div className="absolute inset-0 -z-10 opacity-15 sm:opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-500 rounded-full blur-[80px] sm:blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-400 rounded-full blur-[80px] sm:blur-[140px]" />
      </div>

      <div className="max-w-3xl mx-auto">
        <motion.div className="text-center mb-8 sm:mb-10 md:mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4 px-2 leading-tight">
            {t("contact_heading1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">
              {t("contact_heading_hl")}
            </span>?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-2">
            {t("contact_subtitle")}
          </p>
        </motion.div>

        <motion.div
          className="bg-white/10 dark:bg-slate-900/30 backdrop-blur-sm p-5 sm:p-6 md:p-8 rounded-2xl border border-white/30 dark:border-slate-700/50 shadow-xl"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
        >
          {contactSent ? (
            <motion.div className="text-center py-8 sm:py-12" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="mb-4 sm:mb-6 flex justify-center">
                <svg className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">{t("contact_success_title")}</h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 px-2">{t("contact_success_desc")}</p>
            </motion.div>
          ) : (
            <form onSubmit={sendContact} className="space-y-4 sm:space-y-5">
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm text-center">
                  {error}
                </motion.div>
              )}

              {/* Nombre + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {t("contact_name")} *
                  </label>
                  <input type="text" value={form.name} onChange={set("name")}
                    className={inputClass} placeholder={t("contact_name_placeholder")}
                    required disabled={submitting} autoCapitalize="words" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {t("contact_email")} *
                  </label>
                  <input type="email" value={form.email} onChange={set("email")}
                    className={inputClass} placeholder="tu@email.com"
                    required disabled={submitting} autoComplete="email" />
                </div>
              </div>

              {/* Teléfono + Tipo de proyecto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Teléfono <span className="text-slate-400 font-normal">(opcional)</span>
                  </label>
                  <input type="tel" value={form.phone} onChange={set("phone")}
                    className={inputClass} placeholder="+34 600 000 000"
                    disabled={submitting} autoComplete="tel" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Tipo de proyecto
                  </label>
                  <select value={form.projectType} onChange={set("projectType")} className={selectClass} disabled={submitting}>
                    <option value="">Selecciona una opción</option>
                    {PROJECT_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Presupuesto */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Presupuesto estimado
                </label>
                <select value={form.budget} onChange={set("budget")} className={selectClass} disabled={submitting}>
                  <option value="">Selecciona un rango</option>
                  {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Mensaje */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t("contact_message")} *
                </label>
                <textarea value={form.message} onChange={set("message")}
                  className="w-full bg-white/20 dark:bg-slate-900/50 border border-white/30 dark:border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 dark:text-white placeholder-slate-500 resize-none transition-colors min-h-[120px] sm:min-h-[140px]"
                  placeholder={t("contact_msg_placeholder")} rows={5} required disabled={submitting} />
              </div>

              <button type="submit" disabled={submitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-bold py-3 sm:py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/30 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px] text-sm sm:text-base">
                {submitting ? (
                  <>
                    <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t("contact_sending")}
                  </>
                ) : t("contact_send")}
              </button>

              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 text-center px-4">
                {t("contact_privacy")}
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
