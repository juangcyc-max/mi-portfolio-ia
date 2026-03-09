"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface LandingHeaderProps {
  onNavigate?: (section: string) => void;
}

export default function LandingHeader({ onNavigate }: LandingHeaderProps) {
  const navItems = [
    { id: "features", label: "Características" },
    { id: "pricing", label: "Precios" },
    { id: "contact", label: "Contacto" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200"
    >
      {/* CONTENEDOR REAL DEL HEADER */}
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <img
          src="/logo-adlaunch.png"
          alt="AdLaunch Studio"
          className="w-80 h-auto"
        />

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-slate-600 hover:text-slate-900 hidden sm:block"
          >
            ← Portafolio
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl"
          >
            Demostración
          </motion.button>
        </div>

      </div>
    </motion.header>
  );
}