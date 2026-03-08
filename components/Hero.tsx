"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400 rounded-full blur-[120px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Content */}
          <motion.div 
            className="flex flex-col gap-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Availability Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-wider w-fit"
              variants={fadeInUp}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Disponible para Proyectos
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              className="text-5xl md:text-7xl font-black leading-tight tracking-tight text-slate-900 dark:text-white"
              variants={fadeInUp}
            >
              MINDBRIDGE <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-400">IA</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl"
              variants={fadeInUp}
            >
              Desarrollo Web y Automatizaciones con IA Integrada para Empresas. Soluciones de vanguardia que transforman la productividad.
            </motion.p>

            {/* Bio Card */}
            <motion.div 
              className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6 border border-slate-200 dark:border-slate-800 shadow-xl"
              variants={fadeInUp}
            >
              <div className="size-20 rounded-full overflow-hidden border-2 border-emerald-500/30 shrink-0 bg-white dark:bg-slate-800">
                <Image 
                  src="/logo.svg" 
                  alt="Juan Gutiérrez" 
                  width={80} 
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg dark:text-white">Juan Gutiérrez de la Concha de la Cuesta</h3>
                <p className="text-emerald-500 text-sm font-semibold mb-2">Especialista en Web + IA</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Impulsando la innovación tecnológica a través de arquitecturas modernas y modelos de lenguaje avanzados.
                </p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div className="flex flex-wrap gap-4 pt-4" variants={fadeInUp}>
              <a 
                href="#demo" 
                className="bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform"
              >
                Empezar Proyecto
              </a>
              <a 
                href="#servicios" 
                className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-md px-8 py-4 rounded-xl font-bold dark:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Ver Servicios
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column: Visual */}
          <motion.div 
            className="relative group"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl aspect-square md:aspect-video lg:aspect-square border border-slate-800 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">🤖</div>
                  <p className="text-slate-400">IA + Desarrollo Web</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}