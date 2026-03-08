"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden">

      {/* Glow Background */}
      <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400 rounded-full blur-[140px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE */}
          <motion.div
            className="flex flex-col gap-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >

            {/* Availability Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-wider w-fit"
              variants={fadeInUp}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Disponible para Proyectos
            </motion.div>

            {/* TITLE */}
            <motion.h1
              className="text-5xl md:text-7xl font-black leading-tight tracking-tight text-slate-900 dark:text-white"
              variants={fadeInUp}
            >
              MINDBRIDGE{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-400">
                IA
              </span>
            </motion.h1>

            {/* SUBTITLE */}
            <motion.p
              className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl"
              variants={fadeInUp}
            >
              Desarrollo Web y Automatizaciones con IA Integrada para Empresas.
              Soluciones de vanguardia que transforman la productividad.
            </motion.p>

            {/* BIO CARD */}
            <motion.div
              className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6 border border-slate-200/70 dark:border-slate-800 shadow-xl"
              variants={fadeInUp}
            >
              <div className="size-24 rounded-full overflow-hidden shrink-0 bg-white dark:bg-slate-800 flex items-center justify-center p-2">
                <Image
                  src="/logo.png"
                  alt="Juan Gutiérrez"
                  width={88}
                  height={88}
                  className="object-contain"
                  priority
                />
              </div>

              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Juan Gutiérrez de la Concha
                </h3>

                <p className="text-emerald-500 text-sm font-semibold mb-2">
                  Especialista en Web + IA
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Impulsando la innovación tecnológica mediante arquitecturas
                  modernas y modelos de lenguaje avanzados.
                </p>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              className="flex flex-wrap gap-4 pt-4"
              variants={fadeInUp}
            >
              <Link
                href="#demo"
                className="bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-emerald-500/30"
              >
                Empezar Proyecto
              </Link>

              <Link
                href="#servicios"
                className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl px-8 py-4 rounded-xl font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-colors"
              >
                Ver Servicios
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

            <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl aspect-square md:aspect-video lg:aspect-square border border-slate-800 flex items-center justify-center">

              <div className="text-center p-8">

                <div className="text-8xl mb-6">🤖</div>

                <p className="text-slate-400 text-lg">
                  IA + Desarrollo Web
                </p>

              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}