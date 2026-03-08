"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-24 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-t border-slate-200/60 dark:border-slate-800/60 py-14">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">

          {/* Logo */}
          <div className="flex items-center gap-3 select-none">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Mindbridge IA Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>

            <span className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Mindbridge IA
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">

            <Link
              href="#servicios"
              className="hover:text-emerald-500 transition-colors"
            >
              Desarrollo Web
            </Link>

            <Link
              href="#demo"
              className="hover:text-emerald-500 transition-colors"
            >
              IA Generativa
            </Link>

            <Link
              href="#servicios"
              className="hover:text-emerald-500 transition-colors"
            >
              Automatización
            </Link>

            <Link
              href="#contacto"
              className="hover:text-emerald-500 transition-colors"
            >
              Consultoría Tech
            </Link>

          </nav>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-200/60 dark:border-slate-800/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400">

          <p>
            © {new Date().getFullYear()} Mindbridge IA. Todos los derechos reservados.
          </p>

          <div className="flex gap-6">

            <Link
              href="#"
              className="hover:text-emerald-500 transition-colors"
            >
              Privacidad
            </Link>

            <Link
              href="#"
              className="hover:text-emerald-500 transition-colors"
            >
              Términos
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}