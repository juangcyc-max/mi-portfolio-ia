"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Cookie } from "lucide-react";

const COOKIE_CONSENT_KEY = "mb_cookie_consent";

type ConsentValue = "all" | "essential" | null;

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentValue;
    if (!stored) {
      // Pequeño delay para que no aparezca mientras la página carga
      const timer = setTimeout(() => {
        setVisible(true);
        setAnimating(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAcceptAll() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "all");
    close();
  }

  function handleEssentialOnly() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "essential");
    // Eliminar cookies de preferencia si existen
    document.cookie = "theme=; max-age=0; path=/";
    document.cookie = "lang=; max-age=0; path=/";
    close();
  }

  function close() {
    setAnimating(false);
    setTimeout(() => setVisible(false), 300);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Banner de cookies"
      className={`
        fixed bottom-0 left-0 right-0 z-[9999]
        transition-transform duration-300 ease-out
        ${animating ? "translate-y-0" : "translate-y-full"}
      `}
    >
      {/* Fondo con blur igual que el Navbar */}
      <div className="backdrop-blur-md bg-white/90 dark:bg-slate-900/95 border-t border-slate-200/60 dark:border-slate-700/60 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

            {/* Icono + Texto */}
            <div className="flex items-start gap-3 flex-1">
              <Cookie
                size={20}
                className="text-emerald-500 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Usamos cookies técnicas y de preferencia (tema, idioma) para mejorar tu experiencia.{" "}
                <Link
                  href="/cookies"
                  className="text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-2 font-medium"
                >
                  Más información
                </Link>
              </p>
            </div>

            {/* Botones */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={handleEssentialOnly}
                className="
                  flex-1 sm:flex-none
                  px-4 py-2 rounded-lg text-xs font-medium
                  border border-slate-300 dark:border-slate-600
                  text-slate-600 dark:text-slate-300
                  hover:bg-slate-100 dark:hover:bg-slate-800
                  transition-colors
                "
              >
                Solo esenciales
              </button>
              <button
                onClick={handleAcceptAll}
                className="
                  flex-1 sm:flex-none
                  px-4 py-2 rounded-lg text-xs font-semibold
                  bg-emerald-500 hover:bg-emerald-600
                  text-white
                  transition-colors
                  shadow-sm
                "
              >
                Aceptar todas
              </button>
              <button
                onClick={handleEssentialOnly}
                aria-label="Cerrar banner de cookies"
                className="
                  p-1.5 rounded-lg
                  text-slate-400 hover:text-slate-600 dark:hover:text-slate-200
                  hover:bg-slate-100 dark:hover:bg-slate-800
                  transition-colors
                "
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
