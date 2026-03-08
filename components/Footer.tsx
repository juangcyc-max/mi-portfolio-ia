"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-cyan-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-lg font-black dark:text-white uppercase tracking-tighter">
              Mindbridge IA
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500 dark:text-slate-400">
            <a href="#servicios" className="hover:text-emerald-500 transition-colors">
              Desarrollo Web
            </a>
            <a href="#demo" className="hover:text-emerald-500 transition-colors">
              IA Generativa
            </a>
            <a href="#servicios" className="hover:text-emerald-500 transition-colors">
              Automatización
            </a>
            <a href="#contacto" className="hover:text-emerald-500 transition-colors">
              Consultoría Tech
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-200 dark:border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Mindbridge IA. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">Privacidad</a>
            <a href="#" className="hover:underline">Términos</a>
          </div>
        </div>

      </div>
    </footer>
  );
}