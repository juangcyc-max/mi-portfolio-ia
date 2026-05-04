"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6 max-w-md"
      >
        <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Image src="/logo.svg" alt="Mindbridge IA" width={48} height={48} />
        </div>

        <div>
          <p className="text-emerald-500 font-bold text-sm uppercase tracking-widest mb-2">Error 404</p>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3">
            Página no encontrada
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            Esta página no existe o ha sido movida. Vuelve al inicio y sigue explorando.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/"
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-center transition"
          >
            Volver al inicio
          </Link>
          <Link
            href="/#contacto"
            className="flex-1 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-500 font-bold py-3 rounded-xl text-center transition"
          >
            Contactar
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
