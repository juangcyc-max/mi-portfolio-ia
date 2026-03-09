"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const services = [
  {
    title: "Desarrollo Web Profesional",
    description: "Sitios modernos, rápidos y optimizados con Next.js y React. Enfoque en performance y experiencia de usuario excepcional.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    features: ["SEO Optimizado", "Responsive Design"]
  },
  {
    title: "Integración de IA",
    description: "Implementación de modelos de lenguaje (LLMs) y visión artificial adaptados a las necesidades específicas de tu sector.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    features: ["Modelos Personalizados", "RAG & Vector DBs"]
  },
  {
    title: "Automatizaciones",
    description: "Optimización de flujos de trabajo mediante agentes inteligentes que ejecutan tareas repetitivas de forma autónoma.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    features: ["Workflow Automation", "Agentes IA Autónomos"]
  }
];

export default function Services() {
  return (
    <section className="py-24 bg-transparent" id="servicios">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.p 
            className="text-emerald-500 font-bold text-sm uppercase tracking-widest mb-3" 
            variants={fadeInUp}
          >
            Nuestra Experiencia
          </motion.p>
          <motion.h2 
            className="text-3xl md:text-4xl font-black dark:text-white mb-6" 
            variants={fadeInUp}
          >
            Servicios Especializados
          </motion.h2>
          <motion.p 
            className="text-slate-600 dark:text-slate-400" 
            variants={fadeInUp}
          >
            Combinamos el poder de la Inteligencia Artificial con el desarrollo web de alto rendimiento para escalar tu negocio.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white/10 dark:bg-slate-800/30 backdrop-blur-sm p-8 rounded-2xl border border-white/30 dark:border-slate-700/50 hover:border-emerald-500/50 transition-all group"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
            >
              {/* Icon - SVG Profesional */}
              <div className="size-14 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold dark:text-white mb-4">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Features List */}
              <ul className="space-y-3">
                {service.features.map((feature, i) => (
                  <li 
                    key={i} 
                    className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400"
                  >
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}