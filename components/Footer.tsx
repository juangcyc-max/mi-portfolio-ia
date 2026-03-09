"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative backdrop-blur-sm bg-white/10 dark:bg-slate-900/20 border-t border-white/20 dark:border-slate-700/40 py-4">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Contenido en una sola fila */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          {/* Logo + Copyright */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="Mindbridge IA Logo"
                width={70}
                height={70}
                className="object-contain"
              />
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} Mindbridge IA. Todos los derechos reservados.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">

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

            <span className="text-slate-300 dark:text-slate-600">|</span>

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

          </nav>
        </div>

      </div>

    </footer>
  );
}