"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  // Inicializar tema: localStorage → sistema → default (dark)
  useEffect(() => {
    setMounted(true);
    
    // 1. Verificar localStorage
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme) {
      // Usar preferencia guardada
      const dark = savedTheme === "dark";
      setIsDark(dark);
      document.documentElement.classList.toggle("dark", dark);
    } else {
      // 2. Verificar preferencia del sistema
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(systemDark);
      document.documentElement.classList.toggle("dark", systemDark);
    }
  }, []);

  // Toggle con persistencia
  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    // Actualizar DOM
    document.documentElement.classList.toggle("dark", newIsDark);
    
    // Guardar en localStorage
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
  };

  // Evitar hydration mismatch
  if (!mounted) return null;

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors border border-slate-300 dark:border-slate-700"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
    >
      {isDark ? (
        <span className="text-xl" role="img" aria-label="sol">☀️</span>
      ) : (
        <span className="text-xl" role="img" aria-label="luna">🌙</span>
      )}
    </motion.button>
  );
}