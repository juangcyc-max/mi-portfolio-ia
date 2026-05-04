"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section
      className="relative pt-20 sm:pt-24 md:pt-32 pb-20 sm:pb-24 md:pb-32 overflow-hidden bg-transparent"
      id="hero"
      suppressHydrationWarning
    >
      {/* Glow Background */}
      <div className="absolute inset-0 -z-10 opacity-20 sm:opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500 rounded-full blur-[100px] sm:blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-400 rounded-full blur-[100px] sm:blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">

          {/* LEFT SIDE */}
          <motion.div
            className="flex flex-col gap-6 sm:gap-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Availability Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider w-fit"
              variants={fadeInUp}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              {t("hero_available")}
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-lg"
              variants={fadeInUp}
            >
              MINDBRIDGE{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">
                IA
              </span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl"
              variants={fadeInUp}
            >
              {t("hero_subtitle")}
            </motion.p>

            {/* Bio Card */}
            <motion.div
              className="bg-white/60 dark:bg-white/[0.03] backdrop-blur-2xl p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-4 sm:gap-6 border border-slate-200/50 dark:border-white/10 shadow-lg dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:bg-white/80 dark:hover:bg-white/[0.06] transition-colors duration-500 group"
              variants={fadeInUp}
            >
              <div className="size-20 sm:size-24 rounded-full overflow-hidden shrink-0 bg-emerald-500/10 dark:bg-white/5 border border-emerald-500/20 dark:border-white/10 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-500">
                <Image src="/logo.svg" alt="Juan Gutiérrez" width={72} height={72} className="object-contain" priority />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  Juan Gutiérrez de la Concha
                </h3>
                <p className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
                  {t("hero_role")}
                </p>
                <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {t("hero_bio")}
                </p>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 w-full sm:w-auto"
              variants={fadeInUp}
            >
              <Link
                href="#demo"
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-black text-sm sm:text-base transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/25 text-center min-h-[48px] flex items-center justify-center"
              >
                {t("hero_cta_primary")}
              </Link>
              <Link
                href="#planes"
                className="w-full sm:w-auto bg-emerald-500/10 dark:bg-white/[0.03] backdrop-blur-2xl px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-emerald-700 dark:text-white border border-emerald-500/20 dark:border-white/10 hover:bg-emerald-500/20 dark:hover:bg-white/[0.1] transition-all duration-300 text-sm sm:text-base text-center min-h-[48px] flex items-center justify-center"
              >
                {t("hero_cta_secondary")}
              </Link>
            </motion.div>

            {/* Trust signal */}
            <motion.div
              className="flex items-center gap-3 pt-1"
              variants={fadeInUp}
            >
              <div className="flex -space-x-1.5">
                {["L", "D", "A"].map((initial, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: ["#10b981", "#3b82f6", "#8b5cf6"][i] }}
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-200">5.0</span> · 3 clientes satisfechos
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE — MI3 Agent visual */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-2xl blur opacity-20 sm:opacity-30 group-hover:opacity-40 transition duration-1000" />

            <div className="relative bg-white/60 dark:bg-white/[0.03] backdrop-blur-2xl rounded-2xl border border-slate-200/50 dark:border-white/10 shadow-lg dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex flex-col items-center justify-center gap-6 p-8 sm:p-10 min-h-[340px]">

              {/* Logo con glow animado */}
              <div className="relative">
                <motion.div
                  className="absolute inset-0 rounded-full bg-emerald-400/20 blur-2xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="size-28 sm:size-36 rounded-full bg-emerald-500/10 dark:bg-white/5 border border-emerald-500/20 dark:border-white/10 flex items-center justify-center p-5">
                  <Image
                    src="/logo.svg"
                    alt="MI3 Agente IA"
                    width={100}
                    height={100}
                    className="object-contain drop-shadow-lg"
                    priority
                  />
                </div>
              </div>

              {/* Identificación */}
              <div className="text-center space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-500">
                  MI3 · Asistente IA
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Tu consultor digital en tiempo real
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                {[
                  { value: "100%", label: "Satisfacción" },
                  { value: "24h", label: "Respuesta" },
                  { value: "3+", label: "Proyectos" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.15 }}
                    className="flex flex-col items-center bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-xl px-2 py-3"
                  >
                    <span className="text-base font-black text-emerald-500">{stat.value}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 text-center leading-tight mt-0.5">{stat.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA hacia el chat */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500"
              >
                <motion.div
                  animate={{ x: [-3, 0, -3] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  ↙
                </motion.div>
                Abre el chat con el botón inferior izquierdo
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
