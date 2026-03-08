"use client";

import { motion } from "framer-motion";
import { fadeInDown } from "@/lib/animations";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";

export default function Navbar() {
  return (
    <motion.header 
      className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800"
      initial="hidden"
      animate="visible"
      variants={fadeInDown}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
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

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <a href="#servicios" className="hover:text-emerald-500 transition-colors">Servicios</a>
            <a href="#tecnologias" className="hover:text-emerald-500 transition-colors">Tecnologías</a>
            <a href="#demo" className="hover:text-emerald-500 transition-colors">Demo</a>
          </nav>

          {/* Right Side: Theme Toggle + CTA */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <a 
              href="#contacto" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              Contactar
            </a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}