"use client";

import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Reproducir/Pausar audio
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

  // Cuando el audio termina
  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  return (
    <section className="relative pt-24 pb-32 overflow-hidden">

      {/* Audio oculto */}
      <audio
        ref={audioRef}
        src="/audioparaweb.mp3"
        onEnded={handleAudioEnd}
        onError={(e) => console.error("Error cargando audio:", e)}
      />

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
              className="bg-white/20 dark:bg-slate-900/30 backdrop-blur-sm p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6 border border-white/30 dark:border-slate-700/50 shadow-xl"
              variants={fadeInUp}
            >
              <div className="size-24 rounded-full overflow-hidden shrink-0 bg-white/50 dark:bg-slate-800/50 flex items-center justify-center p-2">
                <Image
                  src="/logo.svg"
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
                className="bg-white/20 dark:bg-slate-900/30 backdrop-blur-sm px-8 py-4 rounded-xl font-bold text-slate-900 dark:text-white border border-white/30 dark:border-slate-700/50 hover:bg-white/30 dark:hover:bg-slate-800/40 transition-colors"
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
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

            <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl aspect-square md:aspect-video lg:aspect-square border border-slate-700/50 flex items-center justify-center">

              {/* CONTENEDOR DEL LOGO ANIMADO */}
              <div className="text-center p-8">
                
                {/* Logo con animación de habla */}
                <div className="relative inline-block">
                  
                  {/* Glow cuando reproduce */}
                  <AnimatePresence>
                    {isPlaying && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-emerald-500/40 to-cyan-400/40 rounded-full blur-2xl"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1.3 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Contenedor del logo - CLICK EN TODA EL ÁREA */}
                  <motion.div
                    className="relative size-40 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-600/50 flex items-center justify-center p-6 shadow-2xl cursor-pointer hover:border-emerald-500/70 transition-all group/logo"
                    onClick={toggleAudio}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isPlaying ? {
                      scale: [1, 1.03, 1],
                      borderColor: ["rgba(148, 163, 184, 0.5)", "rgba(16, 185, 129, 0.9)", "rgba(148, 163, 184, 0.5)"]
                    } : {}}
                    transition={isPlaying ? { duration: 0.6, repeat: Infinity } : {}}
                    title={isPlaying ? "Pausar presentación" : "Reproducir presentación"}
                  >
                    {/* Logo SIEMPRE VISIBLE */}
                    <Image
                      src="/logo.svg"
                      alt="Mindbridge IA Logo"
                      width={140}
                      height={140}
                      className="object-contain drop-shadow-lg"
                      priority
                    />

                    {/* Indicador sutil de play (esquina inferior derecha) */}
                    {!isPlaying && (
                      <motion.div
                        className="absolute -bottom-1 -right-1 size-10 rounded-full bg-emerald-500/90 flex items-center justify-center shadow-lg shadow-emerald-500/50 border-2 border-slate-800"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </motion.div>
                    )}

                    {/* Indicador de pausa (esquina inferior derecha) */}
                    {isPlaying && (
                      <motion.div
                        className="absolute -bottom-1 -right-1 size-10 rounded-full bg-cyan-500/90 flex items-center justify-center shadow-lg shadow-cyan-500/50 border-2 border-slate-800"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Texto profesional */}
                <p className="text-slate-300 text-sm font-medium mt-6 tracking-wide">
                  {isPlaying ? "Reproduciendo presentación..." : "Haz clic en el logo para escuchar"}
                </p>
                
                {/* Indicador de ondas de audio cuando reproduce */}
                <AnimatePresence>
                  {isPlaying && (
                    <motion.div
                      className="flex items-center justify-center gap-1 mt-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.span
                          key={i}
                          className="w-1 bg-gradient-to-t from-emerald-500 to-cyan-400 rounded-full"
                          animate={{
                            height: [8, 20, 8],
                          }}
                          transition={{
                            duration: 0.4,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}