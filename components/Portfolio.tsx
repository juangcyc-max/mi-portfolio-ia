"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import Image from "next/image";
import Link from "next/link";

// Proyectos conceptuales con links a demos interactivas
const projects = [
  {
    title: "E-Commerce Fashion IA",
    category: "E-Commerce + IA",
    description: "Tienda online con recomendaciones personalizadas mediante IA. Los productos se sugieren según el historial de navegación y preferencias del usuario.",
    features: ["Recomendaciones IA", "Carrito inteligente", "Dashboard de ventas"],
    tech: ["Next.js 14", "Supabase", "OpenAI API", "Stripe"],
    color: "from-emerald-500 to-cyan-500",
    image: "/portfolio/ecommerce.jpg",
    link: "/portfolio/ecommerce",  // ✅ Link a demo interactiva
    metrics: {
      conversion: "+40%",
      retention: "+65%",
      speed: "0.8s"
    }
  },
  {
    title: "Dashboard SaaS Analytics",
    category: "Dashboard + Data",
    description: "Panel de control para SaaS con métricas en tiempo real, alertas automáticas y reportes generados con IA. Ideal para startups que necesitan tracking avanzado.",
    features: ["Métricas en vivo", "Alertas automáticas", "Reportes IA"],
    tech: ["React", "TypeScript", "Chart.js", "Tailwind"],
    color: "from-cyan-500 to-blue-500",
    image: "/portfolio/dashboard.jpg",
    link: "/portfolio/dashboard",  // ✅ Link a demo interactiva
    metrics: {
      users: "10K+",
      uptime: "99.9%",
      api: "50M"
    }
  },
  {
    title: "Landing Page Conversión",
    category: "Landing + Marketing",
    description: "Landing page optimizada para conversión con A/B testing integrado, chatbot de cualificación de leads y automatización de email marketing.",
    features: ["A/B Testing", "Chatbot leads", "Email automation"],
    tech: ["Next.js", "Framer Motion", "Resend", "Vercel Analytics"],
    color: "from-blue-500 to-purple-500",
    image: "/portfolio/landing.jpg",
    link: "/portfolio/landing",  // ✅ Link a demo interactiva
    metrics: {
      conversion: "12.5%",
      bounce: "-35%",
      leads: "+200%"
    }
  }
];

export default function Portfolio() {
  return (
    <section className="py-24 bg-transparent" id="portfolio">
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
            Portafolio Conceptual
          </motion.p>
          <motion.h2 
            className="text-3xl md:text-4xl font-black dark:text-white mb-6" 
            variants={fadeInUp}
          >
            Esto es lo que puedo construir <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-400">para ti</span>
          </motion.h2>
          <motion.p 
            className="text-slate-600 dark:text-slate-400" 
            variants={fadeInUp}
          >
            Estos son ejemplos de proyectos que puedo desarrollar. 
            Cada uno está diseñado para resolver problemas reales de negocios como el tuyo.
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="group relative bg-white/10 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/30 dark:border-slate-700/50 hover:border-emerald-500/50 transition-all"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
            >
              {/* Image Placeholder */}
              <div className={`h-48 bg-gradient-to-br ${project.color} relative overflow-hidden`}>
                {/* Aquí puedes poner screenshots reales o mockups */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/30 text-6xl font-black">
                    {project.category.split(" ")[0]}
                  </span>
                </div>
                
                {/* Overlay con botón de ver demo */}
                <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link
                    href={project.link}
                    className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
                  >
                    Ver Demo →
                  </Link>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category Badge */}
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${project.color} text-white mb-3`}>
                  {project.category}
                </span>

                {/* Title */}
                <h3 className="text-xl font-bold dark:text-white mb-3">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {Object.entries(project.metrics).map(([key, value], i) => (
                    <div key={i} className="text-center p-2 bg-white/5 dark:bg-slate-900/30 rounded-lg">
                      <p className="text-lg font-black text-emerald-500">{value}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{key}</p>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-4">
                  {project.features.map((feature, i) => (
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

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/20 dark:border-slate-700/50">
                  {project.tech.map((tech, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-900/50 text-xs font-medium text-slate-600 dark:text-slate-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          className="text-center mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
            ¿Te gusta alguno de estos proyectos? Puedo adaptarlo a tu negocio.
          </p>
          <Link
            href="#contacto"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105"
          >
            Hablemos de tu proyecto
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}