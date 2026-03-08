"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const services = [
  {
    title: "Desarrollo Web Profesional",
    description: "Sitios modernos, rápidos y optimizados con Next.js y React. Enfoque en performance y experiencia de usuario excepcional.",
    icon: "💻",
    features: ["SEO Optimizado", "Responsive Design"]
  },
  {
    title: "Integración de IA",
    description: "Implementación de modelos de lenguaje (LLMs) y visión artificial adaptados a las necesidades específicas de tu sector.",
    icon: "🧠",
    features: ["Modelos Personalizados", "RAG & Vector DBs"]
  },
  {
    title: "Automatizaciones",
    description: "Optimización de flujos de trabajo mediante agentes inteligentes que ejecutan tareas repetitivas de forma autónoma.",
    icon: "⚡",
    features: ["Workflow Automation", "Agentes IA Autónomos"]
  }
];

export default function Services() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50" id="servicios">
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
            Nuestra Experticia
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
              className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-md p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all group"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
            >
              {/* Icon */}
              <div className="size-14 rounded-xl bg-emerald-500/10 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
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
                    <span className="text-emerald-500">✓</span> {feature}
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