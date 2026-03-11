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

  // ============================================
  // SCROLL LOCK CUANDO EL MENÚ MÓVIL ESTÁ ABIERTO
  // ============================================
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY) * -1);
      }
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isMobileMenuOpen]);

  // Detectar scroll para cambiar estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ SCROLL MANUAL PARA ANCLAS
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
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
      setIsMobileMenuOpen(false);
    }
  };

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    const handleRouteChange = () => setIsMobileMenuOpen(false);
    window.addEventListener("hashchange", handleRouteChange);
    return () => window.removeEventListener("hashchange", handleRouteChange);
  }, []);

  return (
    <motion.header
      className={`sticky top-0 z-50 transition-all duration-500 border-b ${
        scrolled || isMobileMenuOpen
          ? "backdrop-blur-md bg-white/80 dark:bg-slate-900/90 shadow-lg shadow-slate-900/5 dark:shadow-black/30 border-slate-200/50 dark:border-slate-700/50"
          : "backdrop-blur-sm bg-white/20 dark:bg-slate-900/40 border-transparent"
      }`}
      initial="hidden"
      animate="visible"
      variants={fadeInDown}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">

          {/* Logo - Área táctil más grande en móvil */}
          <Link 
            href="/" 
            className="flex items-center gap-2 sm:gap-3 select-none outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg transition-shadow z-50 p-1 -m-1"
            aria-label="Ir a la página de inicio"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-white/50 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
              <Image
                src="/logo.svg"
                alt="Logotipo de Mindbridge IA"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            {/* ✅ GRADIENTE VERDE SOLO (sin cyan) */}
            <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-emerald-400 dark:to-emerald-500">
              Mindbridge IA
            </span>
          </Link>

          {/* Navegación Principal (Desktop) */}
          <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleAnchorClick(e, item.href)}
                className="group relative px-3 lg:px-4 py-2 text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md cursor-pointer"
              >
                {item.label}
                {/* ✅ GRADIENTE VERDE SOLO (sin cyan) */}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-500 group-hover:w-full group-hover:left-0 transition-all duration-300 pointer-events-none"></span>
              </a>
            ))}
          </nav>

          {/* Lado Derecho (Desktop & Mobile Actions) */}
          <div className="flex items-center gap-2 sm:gap-3 z-50">
            <ThemeToggle />

            {/* CTA Desktop */}
            <div className="hidden md:block">
              <a
                href="#contacto"
                onClick={(e) => handleAnchorClick(e, "#contacto")}
                className="group relative bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white px-5 lg:px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-offset-slate-900 cursor-pointer"
              >
                <span className="relative z-10">Contactar</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></span>
              </a>
            </div>

            {/* Mobile Menu Toggle - Área táctil más grande */}
            <button
              type="button"
              className="md:hidden flex items-center justify-center p-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors min-w-[44px] min-h-[44px]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú de navegación"}
              aria-controls="mobile-menu"
            >
              <motion.div
                key={isMobileMenuOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable Móvil - Optimizado para táctil */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50"
            role="dialog"
            aria-modal="true"
          >
            <div className="px-4 pt-4 pb-8 space-y-2">
              {NAV_ITEMS.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <a
                    href={item.href}
                    onClick={(e) => {
                      handleAnchorClick(e, item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block px-4 py-4 text-base font-bold text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800/50 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl transition-colors outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer min-h-[56px] flex items-center"
                  >
                    {item.label}
                  </a>
                </motion.div>
              ))}
              
              {/* CTA Mobile - Separado y más grande */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="pt-6 px-2"
              >
                <a
                  href="#contacto"
                  onClick={(e) => {
                    handleAnchorClick(e, "#contacto");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex justify-center w-full bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white px-6 py-4 rounded-xl font-bold text-base transition-all shadow-lg shadow-emerald-500/25 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-offset-slate-900 cursor-pointer min-h-[56px] flex items-center justify-center"
                >
                  Contactar
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay para cerrar menú al hacer clic fuera (móvil) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
}