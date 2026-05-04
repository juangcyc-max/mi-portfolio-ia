"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Bot, Mic, Map } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function AIDemo() {
  const { t } = useTranslation();
  return (
    <section
      className="py-12 sm:py-16 md:py-24 px-4 bg-transparent"
      id="demo"
      suppressHydrationWarning
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-10 md:mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.p
            className="text-emerald-500 font-bold text-xs sm:text-sm uppercase tracking-widest mb-3"
            variants={fadeInUp}
          >
            {t("demo_badge")}
          </motion.p>
          <motion.h3
            className="text-2xl sm:text-3xl md:text-4xl font-black dark:text-white mb-3 sm:mb-4 px-2 leading-tight"
            variants={fadeInUp}
          >
            {t("demo_title")}
          </motion.h3>
          <motion.p
            className="text-sm sm:text-base text-slate-600 dark:text-slate-400 px-2 max-w-xl mx-auto"
            variants={fadeInUp}
          >
            {t("demo_subtitle")}
          </motion.p>
        </motion.div>

        {/* MI3 Agent CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-white/10 shadow-lg p-8 sm:p-10 flex flex-col items-center gap-6 text-center"
        >
          {/* Icono animado */}
          <motion.div
            className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
            animate={{ boxShadow: ["0 0 0 0 rgba(16,185,129,0)", "0 0 0 12px rgba(16,185,129,0.1)", "0 0 0 0 rgba(16,185,129,0)"] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <Bot size={36} className="text-emerald-500" />
          </motion.div>

          <div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              MI3 — Asistente IA en vivo
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
              Habla con nuestro agente de inteligencia artificial. Responde tus dudas, te asesora sobre precios y puede hacer un tour completo de esta web mientras te lo explica en voz.
            </p>
          </div>

          {/* Capacidades */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg">
            {[
              { icon: <Bot size={18} />, label: "Chat de texto", desc: "Escribe tu pregunta" },
              { icon: <Mic size={18} />, label: "Voz en español", desc: "Habla directamente" },
              { icon: <Map size={18} />, label: "Tour de la web", desc: "\"Muéstrame todo\"" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1.5 bg-slate-50 dark:bg-white/5 rounded-xl p-4 border border-slate-200/60 dark:border-white/10">
                <span className="text-emerald-500">{item.icon}</span>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.label}</p>
                <p className="text-[10px] text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Flecha al botón */}
          <div className="flex items-center gap-3 text-sm text-slate-400 dark:text-slate-500">
            <motion.span
              animate={{ x: [-4, 0, -4] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="text-emerald-500 font-bold text-lg"
            >
              ↙
            </motion.span>
            Pulsa el botón verde inferior izquierdo para abrir el chat
          </div>
        </motion.div>

      </div>
    </section>
  );
}
