"use client";

import { motion, AnimatePresence } from "framer-motion";
import { fadeInDown } from "@/lib/animations";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#tecnologias", label: "Tecnologías" },
  { href: "#demo", label: "Chat IA" },
  { href: "#portfolio", label: "Portfolio" }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll lock cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll manual para anclas
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    const element = document.querySelector(href);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "backdrop-blur-md bg-white/95 dark:bg-slate-900/95 shadow-lg border-slate-200/50 dark:border-slate-700/50"
          : "backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border-slate-200/50 dark:border-slate-700/50"
      }`}
      initial="hidden"
      animate="visible"
      variants={fadeInDown}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">

          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 sm:gap-3 select-none"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-white/50 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
              <Image
                src="/logo.svg"
                alt="Mindbridge IA"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-emerald-400 dark:to-emerald-500">
              Mindbridge IA
            </span>
          </Link>

          {/* Navegación Desktop - SOLO SE VE EN DESKTOP */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleAnchorClick(e, item.href)}
                className="group relative px-3 lg:px-4 py-2 text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-500 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              </a>
            ))}
          </nav>

          {/* Lado Derecho */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* CTA Desktop - SOLO SE VE EN DESKTOP */}
            <div className="hidden md:block">
              <a
                href="#contacto"
                onClick={(e) => handleAnchorClick(e, "#contacto")}
                className="group relative bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white px-5 lg:px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 overflow-hidden"
              >
                <span className="relative z-10">Contactar</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </a>
            </div>

            {/* Botón Hamburguesa - SOLO SE VE EN MÓVIL */}
            <button
              type="button"
              className="md:hidden flex items-center justify-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors min-w-[44px] min-h-[44px]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMobileMenuOpen ? (
                /* X para cerrar */
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                /* Hamburguesa para abrir */
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay oscuro cuando el menú está abierto */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Menú Móvil - PANEL LATERAL */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed top-16 left-0 right-0 bottom-0 z-30 bg-white dark:bg-slate-900 md:hidden overflow-y-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex flex-col p-6 space-y-4">
              {NAV_ITEMS.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  className="block px-6 py-4 text-lg font-bold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.label}
                </motion.a>
              ))}
              
              {/* CTA Mobile */}
              <motion.div
                className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <a
                  href="#contacto"
                  onClick={(e) => handleAnchorClick(e, "#contacto")}
                  className="flex justify-center w-full bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white px-6 py-4 rounded-xl font-bold text-base transition-all shadow-lg shadow-emerald-500/25"
                >
                  Contactar
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}