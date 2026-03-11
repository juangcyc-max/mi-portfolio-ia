"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const services = [
  {
    title: "Desarrollo Web de Élite",
    description: "Arquitecturas de alto rendimiento construidas con Next.js 14+. No solo creamos webs, diseñamos experiencias digitales que convierten visitantes en clientes fieles.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    features: ["Core Web Vitals optimizados", "Arquitectura escalable Cloud", "UX/UI de grado premium"],
    color: "from-emerald-500/20 to-teal-500/20",
    border: "group-hover:border-emerald-500/50 dark:group-hover:border-emerald-400/50"
  },
  {
    title: "Ecosistemas de IA",
    description: "Integramos la inteligencia artificial en el ADN de tu empresa. Desde RAG con bases de datos vectoriales hasta LLMs afinados para tu modelo de negocio específico.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    features: ["Integración de GPT-4 / Claude 3", "Sistemas RAG personalizados", "Análisis predictivo de datos"],
    color: "from-blue-500/20 to-indigo-500/20",
    border: "group-hover:border-blue-500/50 dark:group-hover:border-blue-400/50"
  },
  {
    title: "Automatización Autónoma",
    description: "Desplegamos agentes inteligentes que trabajan 24/7. Eliminamos los cuellos de botella operativos automatizando flujos de trabajo complejos sin intervención humana.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    features: ["Agentes de IA multi-tarea", "Conexión vía API nativa", "Monitorización en tiempo real"],
    color: "from-purple-500/20 to-pink-500/20",
    border: "group-hover:border-purple-500/50 dark:group-hover:border-purple-400/50"
  }
];

export default function Services() {
  const scrollToContact = () => {
    const contactSection = document.getElementById("contacto");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-transparent" id="servicios">
      
      {/* ✅ SIN FONDO VERDE - Solo el fondo transparente */}

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header - Centrado */}
        <motion.div 
          className="max-w-3xl mx-auto mb-20 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.span 
            className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.2em] text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-500/10 dark:bg-emerald-400/10 rounded-full border border-emerald-500/20 dark:border-emerald-400/20 backdrop-blur-md" 
            variants={fadeInUp}
          >
            Engineering Excellence
          </motion.span>
          <motion.h2 
            className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.1] drop-shadow-sm dark:drop-shadow-lg" 
            variants={fadeInUp}
          >
            Soluciones que definen el <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500 drop-shadow-sm">
              Futuro Digital
            </span>
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed" 
            variants={fadeInUp}
          >
            No implementamos herramientas, construimos ventajas competitivas mediante el uso estratégico de la Inteligencia Artificial y el software de alto rendimiento.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className={`group relative p-10 rounded-[2.5rem] bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 transition-all duration-500 hover:bg-white/80 dark:hover:bg-white/[0.08] shadow-lg dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:shadow-emerald-500/10 ${service.border} text-center`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
            >
              {/* Card Gradient Inner Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] pointer-events-none`} />

              <div className="relative z-10 flex flex-col items-center">
                {/* Icon Circle */}
                <div className="size-16 rounded-2xl bg-emerald-500/10 dark:bg-white/5 border border-emerald-500/20 dark:border-white/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-8 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white dark:group-hover:text-slate-950 transition-all duration-500 shadow-md dark:shadow-xl backdrop-blur-md">
                  {service.icon}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight text-center">
                  {service.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8 font-medium text-center max-w-sm mx-auto">
                  {service.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap justify-center gap-2">
                  {services[index].features.map((feature, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-white/5 backdrop-blur-md border border-emerald-500/20 dark:border-white/10 text-[11px] font-bold text-emerald-700 dark:text-slate-200 group-hover:border-emerald-500/40 dark:group-hover:border-white/20 transition-colors shadow-sm"
                    >
                      <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative Corner Arrow */}
              <div className="absolute top-8 right-8 text-emerald-500/20 dark:text-white/10 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA - Centrado */}
        <motion.div 
          className="mt-20 pt-10 border-t border-slate-200/50 dark:border-white/10 flex flex-col items-center text-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto">
            ¿Necesitas una solución a medida?
          </p>
          
          <button 
            onClick={scrollToContact}
            className="px-8 py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-black rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
          >
            AGENDAR CONSULTA TÉCNICA
          </button>
        </motion.div>

      </div>
    </section>
  );
}