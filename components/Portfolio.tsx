"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import Image from "next/image";
import Link from "next/link";

/* ================= TYPES ================= */

type Metric = {
  label: string;
  value: number;
  suffix: string;
};

type Project = {
  title: string;
  category: string;
  description: string;
  features: string[];
  color: string;
  logoBg: string;
  logo: string;
  link: string;
  metrics: Metric[];
};

type CountUpProps = {
  value: number;
  suffix: string;
};

/* ================= DATA ================= */

const projects: Project[] = [
  {
    title: "E-Commerce Fashion IA",
    category: "Comercio electrónico + IA",
    description: "Tienda online con recomendaciones personalizadas mediante IA.",
    features: ["Recomendaciones IA", "Carrito inteligente", "Dashboard ventas"],
    color: "from-emerald-500 to-cyan-500",
    logoBg: "bg-white",
    logo: "/logos/fashion-ia.png",
    link: "/portfolio/ecommerce",
    metrics: [
      { label: "Conversión", value: 40, suffix: "%" },
      { label: "Retención", value: 65, suffix: "%" },
      { label: "Velocidad", value: 0.8, suffix: "s" }
    ]
  },
  {
    title: "Dashboard SaaS Analytics",
    category: "Panel + Data",
    description: "Panel SaaS con métricas en tiempo real y reportes con IA.",
    features: ["Métricas en vivo", "Alertas automáticas", "Reportes IA"],
    color: "from-blue-600 to-cyan-500",
    logoBg: "bg-white",
    logo: "/logos/saaslogo.png",  // ✅ ACTUALIZADO
    link: "/portfolio/dashboard",
    metrics: [
      { label: "Usuarios", value: 10000, suffix: "+" },
      { label: "Uptime", value: 99.9, suffix: "%" },
      { label: "API", value: 50, suffix: "M" }
    ]
  },
  {
    title: "Landing Conversión",
    category: "Landing + Marketing",
    description: "Landing optimizada con A/B testing y automatización marketing.",
    features: ["A/B Testing", "Chatbot leads", "Email automation"],
    color: "from-blue-500 to-purple-500",
    logoBg: "bg-white",
    logo: "/logos/adlaunch-studio.png",
    link: "/portfolio/landing",
    metrics: [
      { label: "Conversión", value: 12.5, suffix: "%" },
      { label: "Rebote", value: -35, suffix: "%" },
      { label: "Leads", value: 200, suffix: "%" }
    ]
  }
];

/* ================= COUNT UP ================= */

function CountUp({ value, suffix }: CountUpProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    
    let start = 0;
    const duration = 1200;
    const step = value / (duration / 16);
    let animationFrame: number;

    const animate = () => {
      start += step;

      if (Math.abs(start) >= Math.abs(value)) {
        setCount(value);
        setHasAnimated(true);
      } else {
        setCount(parseFloat(start.toFixed(1)));
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, hasAnimated]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

/* ================= COMPONENT ================= */

export default function Portfolio() {
  return (
    <section className="py-24 bg-transparent" id="portfolio">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p 
            variants={fadeInUp}
            className="text-emerald-500 font-bold text-sm uppercase tracking-widest mb-3"
          >
            Portafolio Conceptual
          </motion.p>
          
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-black mb-6 dark:text-white"
          >
            Esto es lo que puedo construir{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-400">
              para ti
            </span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-slate-600 dark:text-slate-400 text-lg"
          >
            Estos son ejemplos de proyectos que puedo desarrollar. 
            Cada uno está diseñado para resolver problemas reales de negocios como el tuyo.
          </motion.p>
        </motion.div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const x = useMotionValue(0);
            const y = useMotionValue(0);

            const rotateX = useTransform(y, [-50, 50], [8, -8]);
            const rotateY = useTransform(x, [-50, 50], [-8, 8]);

            function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
              const rect = e.currentTarget.getBoundingClientRect();
              const mouseX = e.clientX - rect.left - rect.width / 2;
              const mouseY = e.clientY - rect.top - rect.height / 2;
              x.set(mouseX);
              y.set(mouseY);
            }

            function handleMouseLeave() {
              x.set(0);
              y.set(0);
            }

            return (
              <motion.div
                key={index}
                style={{ rotateX, rotateY }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="group relative perspective-1000"
              >
                {/* GLOW */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${project.color} opacity-30 blur-xl rounded-2xl group-hover:opacity-60 transition duration-500`}
                />

                {/* CARD */}
                <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xl">

                  {/* LOGO AREA */}
                  <div className={`h-56 bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}>
                    
                    {/* Logo Container - SIEMPRE BLANCO */}
                    <div className="rounded-xl p-8 shadow-2xl transition-transform duration-500 group-hover:scale-95 bg-white">
                      <Image
                        src={project.logo}
                        alt={project.title}
                        width={180}
                        height={90}
                        className="object-contain"
                        priority={index === 0}
                      />
                    </div>

                    {/* DEMO BUTTON OVERLAY */}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Link
                        href={project.link}
                        className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl shadow-2xl hover:scale-105 transition-transform flex items-center gap-2"
                      >
                        Ver Demo
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6">
                    {/* Category Badge */}
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${project.color} text-white mb-4 uppercase tracking-wide`}>
                      {project.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-xl font-bold dark:text-white mb-3">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {project.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* METRICS */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                      {project.metrics.map((metric, i) => (
                        <div key={i} className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                          <p className="font-black text-emerald-500 text-lg">
                            <CountUp value={metric.value} suffix={metric.suffix} />
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                            {metric.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div 
          className="text-center mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
            ¿Te gusta alguno de estos proyectos? Puedo adaptarlo a tu negocio.
          </p>
          <Link
            href="#contacto"
            className="inline-flex items-center gap-3 px-8 py-4 font-bold text-white rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105"
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