"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    const root = document.documentElement;

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      const dark = savedTheme === "dark";
      setIsDark(dark);
      root.classList.toggle("dark", dark);
    } else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(systemDark);
      root.classList.toggle("dark", systemDark);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark === null) return;

    const newTheme = !isDark;
    const root = document.documentElement;

    setIsDark(newTheme);
    root.classList.toggle("dark", newTheme);

    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // evitar hydration error
  if (isDark === null) return null;

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors border border-slate-300 dark:border-slate-700 shadow-sm"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
    >
      {isDark ? (
        <span className="text-lg">☀️</span>
      ) : (
        <span className="text-lg">🌙</span>
      )}
    </motion.button>
  );
}