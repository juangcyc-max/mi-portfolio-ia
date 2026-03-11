"use client";

import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  return (
    <section 
      className="relative pt-20 sm:pt-24 md:pt-32 pb-20 sm:pb-24 md:pb-32 overflow-hidden bg-transparent"
      suppressHydrationWarning
    >
      {/* Audio oculto */}
      <audio
        ref={audioRef}
        src="/audioparaweb.mp3"
        onEnded={handleAudioEnd}
        onError={(e) => console.error("Error cargando audio:", e)}
      />

      {/* Glow Background */}
      <div className="absolute inset-0 -z-10 opacity-20 sm:opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500 rounded-full blur-[100px] sm:blur-[140px]"></div>
        <div className="absolute bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-400 rounded-full blur-[100px] sm:blur-[140px]"></div>
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
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden xs:inline">Disponible para Proyectos</span>
              <span className="xs:hidden">Disponible</span>
            </motion.div>

            {/* TITLE - ✅ GRADIENTE VERDE SOLO (sin cyan/blanco) */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-lg"
              variants={fadeInUp}
            >
              MINDBRIDGE{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500 drop-shadow-sm">
                IA
              </span>
            </motion.h1>

            {/* SUBTITLE - Modo claro/oscuro */}
            <motion.p
              className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl"
              variants={fadeInUp}
            >
              Desarrollo Web y Automatizaciones con IA Integrada para Empresas.
              Soluciones de vanguardia que transforman la productividad.
            </motion.p>

            {/* BIO CARD - Glassmorphism con soporte claro/oscuro */}
            <motion.div
              className="bg-white/60 dark:bg-white/[0.03] backdrop-blur-2xl p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-4 sm:gap-6 border border-slate-200/50 dark:border-white/10 shadow-lg dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:bg-white/80 dark:hover:bg-white/[0.06] transition-colors duration-500 group"
              variants={fadeInUp}
            >
              <div className="size-20 sm:size-24 rounded-full overflow-hidden shrink-0 bg-emerald-500/10 dark:bg-white/5 border border-emerald-500/20 dark:border-white/10 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-500">
                <Image
                  src="/logo.svg"
                  alt="Juan Gutiérrez"
                  width={72}
                  height={72}
                  className="object-contain"
                  priority
                />
              </div>

              <div className="text-center sm:text-left">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white drop-shadow-sm">
                  Juan Gutiérrez de la Concha
                </h3>

                <p className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
                  Especialista en Web + IA
                </p>

                <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Impulsando la innovación tecnológica mediante arquitecturas
                  modernas y modelos de lenguaje avanzados.
                </p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 w-full sm:w-auto"
              variants={fadeInUp}
            >
              <Link
                href="#demo"
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-black text-sm sm:text-base transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 border border-emerald-400/50 text-center min-h-[48px] flex items-center justify-center"
              >
                Empezar Proyecto
              </Link>

              <Link
                href="#servicios"
                className="w-full sm:w-auto bg-emerald-500/10 dark:bg-white/[0.03] backdrop-blur-2xl px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-emerald-700 dark:text-white border border-emerald-500/20 dark:border-white/10 hover:bg-emerald-500/20 dark:hover:bg-white/[0.1] hover:border-emerald-500/40 dark:hover:border-white/20 transition-all duration-300 text-sm sm:text-base text-center min-h-[48px] flex items-center justify-center shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]"
              >
                Ver Servicios
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE - VISUAL CON AUDIO */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-2xl blur opacity-20 sm:opacity-30 group-hover:opacity-40 sm:group-hover:opacity-50 transition duration-1000"></div>

            {/* Contenedor principal */}
            <div className="relative bg-white/60 dark:bg-white/[0.03] backdrop-blur-2xl rounded-2xl overflow-hidden shadow-lg dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:shadow-emerald-500/10 transition-all duration-500 aspect-square sm:aspect-[4/3] md:aspect-video lg:aspect-square border border-slate-200/50 dark:border-white/10 flex items-center justify-center">

              <div className="text-center p-6 sm:p-8">
                
                {/* Logo con animación */}
                <div className="relative inline-block">
                  
                  {isClient && isPlaying && (
                    <AnimatePresence>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-emerald-500/40 to-cyan-400/40 rounded-full blur-xl sm:blur-2xl"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1.3 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      />
                    </AnimatePresence>
                  )}
                  
                  <motion.div
                    className="relative size-32 sm:size-40 rounded-full bg-emerald-500/10 dark:bg-white/5 backdrop-blur-md border border-emerald-500/20 dark:border-white/10 flex items-center justify-center p-4 sm:p-6 shadow-lg dark:shadow-2xl cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/20 dark:hover:bg-white/10 transition-all group/logo min-w-[128px] min-h-[128px]"
                    onClick={toggleAudio}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isPlaying ? {
                      scale: [1, 1.03, 1],
                      borderColor: ["rgba(16, 185, 129, 0.2)", "rgba(16, 185, 129, 0.7)", "rgba(16, 185, 129, 0.2)"]
                    } : {}}
                    transition={isPlaying ? { duration: 0.6, repeat: Infinity } : {}}
                    title={isPlaying ? "Pausar presentación" : "Reproducir presentación"}
                  >
                    <Image
                      src="/logo.svg"
                      alt="Mindbridge IA Logo"
                      width={112}
                      height={112}
                      className="object-contain drop-shadow-lg w-24 h-24 sm:w-32 sm:h-32"
                      priority
                    />

                    {!isPlaying && (
                      <motion.div
                        className="absolute -bottom-1 -right-1 size-8 sm:size-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.6)] border border-emerald-400/50"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </motion.div>
                    )}

                    {isPlaying && (
                      <motion.div
                        className="absolute -bottom-1 -right-1 size-8 sm:size-10 rounded-full bg-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.6)] border border-cyan-400/50"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Texto - Modo claro/oscuro */}
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium mt-4 sm:mt-6 tracking-wide px-2">
                  {isPlaying ? "Reproduciendo..." : "Toca el logo para escuchar"}
                </p>
                
                {isClient && isPlaying && (
                  <AnimatePresence>
                    <motion.div
                      className="flex items-center justify-center gap-1 mt-2 sm:mt-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.span
                          key={i}
                          className="w-0.5 sm:w-1 bg-gradient-to-t from-emerald-400 to-cyan-300 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                          animate={{
                            height: [6, 16, 6],
                          }}
                          transition={{
                            duration: 0.4,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}

              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}