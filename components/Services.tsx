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
    border: "group-hover:border-emerald-500/50"
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
    border: "group-hover:border-blue-500/50"
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
    border: "group-hover:border-purple-500/50"
  }
];

export default function Services() {
  // ✅ Función para scroll suave a contacto
  const scrollToContact = () => {
    const contactSection = document.getElementById("contacto");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-transparent" id="servicios">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <motion.div 
          className="max-w-3xl mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.span 
            className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.2em] text-emerald-400 uppercase bg-emerald-400/10 rounded-full border border-emerald-400/20 backdrop-blur-md" 
            variants={fadeInUp}
          >
            Engineering Excellence
          </motion.span>
          <motion.h2 
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-8 tracking-tight leading-[1.1] drop-shadow-lg" 
            variants={fadeInUp}
          >
            Soluciones que definen el <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-200 to-emerald-500 drop-shadow-sm">
              Futuro Digital
            </span>
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl leading-relaxed drop-shadow-md" 
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
              className={`group relative p-10 rounded-[2.5rem] bg-white/[0.03] backdrop-blur-2xl border border-white/10 transition-all duration-500 hover:bg-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:shadow-emerald-500/10 ${service.border}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
            >
              {/* Card Gradient Inner Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] pointer-events-none`} />

              <div className="relative z-10">
                {/* Icon Circle */}
                <div className="size-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 mb-8 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-500 shadow-xl backdrop-blur-md">
                  {service.icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight drop-shadow-sm">
                  {service.title}
                </h3>

                <p className="text-slate-300 leading-relaxed mb-8 font-medium">
                  {service.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {services[index].features.map((feature, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[11px] font-bold text-slate-200 group-hover:border-white/20 transition-colors shadow-sm"
                    >
                      <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative Corner Arrow */}
              <div className="absolute top-8 right-8 text-white/10 group-hover:text-emerald-500 transition-colors">
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ✅ Footer CTA - BOTÓN CORREGIDO */}
        <motion.div 
          className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-300 font-medium drop-shadow-sm">¿Necesitas una solución a medida?</p>
          
          {/* ✅ Botón: verde sólido + scroll a contacto */}
          <button 
            onClick={scrollToContact}
            className="px-8 py-4 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
          >
            AGENDAR CONSULTA TÉCNICA
          </button>
        </motion.div>

      </div>
    </section>
  );
}