"use client";

import { motion } from "framer-motion";
import { fadeInDown } from "@/lib/animations";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <motion.header
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/60 dark:border-slate-800/60"
      initial="hidden"
      animate="visible"
      variants={fadeInDown}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <div className="flex items-center gap-3 select-none">
            <div className="w-12 h-12 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Mindbridge IA Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>

            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
              Mindbridge IA
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700 dark:text-slate-300">

            <Link
              href="#servicios"
              className="hover:text-emerald-500 transition-colors"
            >
              Servicios
            </Link>

            <Link
              href="#tecnologias"
              className="hover:text-emerald-500 transition-colors"
            >
              Tecnologías
            </Link>

            <Link
              href="#demo"
              className="hover:text-emerald-500 transition-colors"
            >
              Demo
            </Link>

          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            <ThemeToggle />

            <Link
              href="#contacto"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
            >
              Contactar
            </Link>

          </div>
        </div>
      </div>
    </motion.header>
  );
}