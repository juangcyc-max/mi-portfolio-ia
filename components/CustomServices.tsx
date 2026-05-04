"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const services = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    color: "from-violet-500 to-purple-600",
    glow: "violet",
    tag: "IA · VOZ · 24/7",
    title: "Agente IA de Voz",
    desc: "Secretaria virtual con IA que atiende llamadas en español, captura leads, gestiona incidencias y transfiere al responsable cuando es necesario. Sin esperas, sin personal extra.",
    features: ["Atención 24/7 en español de España", "Captura automática de leads", "Gestión de incidencias", "Panel de administración incluido"],
    price: "desde 2.000€",
    monthly: "150€/mes",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    color: "from-cyan-500 to-blue-600",
    glow: "cyan",
    tag: "iOS · ANDROID · NATIVA",
    title: "App Móvil a Medida",
    desc: "Aplicación nativa para iOS y Android adaptada a tu negocio. Gestión de trabajos, geolocalización en tiempo real, notificaciones push y panel de administración.",
    features: ["iOS y Android nativos", "Geolocalización en tiempo real", "Notificaciones push", "Panel de admin incluido"],
    price: "desde 2.500€",
    monthly: "100€/mes",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    color: "from-emerald-500 to-teal-600",
    glow: "emerald",
    tag: "GESTIÓN · MÉTRICAS · INTEGRADO",
    title: "Panel Unificado",
    desc: "Un solo panel para gestionar todo: llamadas, trabajos, clientes, autónomos y métricas. Integra todas tus herramientas en un único lugar y toma decisiones con datos reales.",
    features: ["Panel de control centralizado", "Métricas y reportes en tiempo real", "Integración con tus herramientas actuales", "Formación y documentación incluidas"],
    price: "desde 1.500€",
    monthly: "incluido",
  },
];

export default function CustomServices() {
  const scrollToContact = () => {
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 sm:py-28 px-4 bg-transparent" id="servicios-medida">
      <div className="max-w-7xl mx-auto">

        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          <motion.span variants={fadeInUp} className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.2em] text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-500/10 dark:bg-emerald-400/10 rounded-full border border-emerald-500/20">
            DESARROLLO A MEDIDA
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
            Soluciones para{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">
              escalar tu negocio
            </span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 text-lg">
            Proyectos personalizados cuando tu negocio necesita más que un plan estándar.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((s, i) => (
            <motion.div
              key={i}
              className="group relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeInUp}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${s.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 rounded-3xl`} />

              {/* Header */}
              <div className={`bg-gradient-to-br ${s.color} p-7`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 bg-white/20 rounded-2xl text-white">
                    {s.icon}
                  </div>
                  <span className="text-[9px] font-black tracking-widest text-white/70 uppercase bg-white/10 px-2.5 py-1 rounded-full">
                    {s.tag}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white mb-1">{s.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{s.desc}</p>
              </div>

              {/* Body */}
              <div className="p-7 space-y-5">
                <ul className="space-y-2.5">
                  {s.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                      <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{s.price}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {s.monthly === "incluido" ? "Mantenimiento incluido" : `+ ${s.monthly} mantenimiento`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={scrollToContact}
                    className={`w-full py-3.5 rounded-2xl font-black text-sm text-white bg-gradient-to-r ${s.color} hover:opacity-90 transition-opacity shadow-lg`}
                  >
                    Solicitar presupuesto
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center text-sm text-slate-500 dark:text-slate-400 mt-10"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        >
          Las fases pueden contratarse por separado o en conjunto · 50% al inicio, 50% a la entrega
        </motion.p>

      </div>
    </section>
  );
}
