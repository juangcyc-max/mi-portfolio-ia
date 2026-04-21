"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const REVIEWS = [
  {
    name: "Lisandra Vega Fuente",
    initials: "L",
    color: "#10b981",
    rating: 5,
    text: "Genial, un excelente trabajo con esta página tan funcional, ojalá otros puedan disfrutar de sus beneficios.",
  },
  {
    name: "Diana Gonzalez",
    initials: "D",
    color: "#3b82f6",
    rating: 5,
    text: null,
  },
  {
    name: "Alessandra Borda Pardo",
    initials: "A",
    color: "#8b5cf6",
    rating: 5,
    text: null,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p variants={fadeInUp} className="text-emerald-500 font-bold text-xs uppercase tracking-widest mb-3">
            Reseñas verificadas
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-black dark:text-white mb-4">
            Lo que dicen{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">
              los clientes
            </span>
          </motion.h2>

          {/* Overall score */}
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3 shadow-sm mt-2">
            <svg viewBox="0 0 24 24" className="w-6 h-6" aria-label="Google">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black dark:text-white">5.0</span>
                <Stars count={5} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">3 reseñas en Google</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {REVIEWS.map((r, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: r.color }}
                >
                  {r.initials}
                </div>
                <div>
                  <p className="font-bold text-sm dark:text-white leading-tight">{r.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Stars count={r.rating} />
                    <span className="text-xs text-slate-400">· Google</span>
                  </div>
                </div>
              </div>
              {r.text ? (
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  "{r.text}"
                </p>
              ) : (
                <p className="text-xs text-slate-400 italic">Sin comentario escrito</p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
