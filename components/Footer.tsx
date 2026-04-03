"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer
      className="relative backdrop-blur-sm bg-white/10 dark:bg-slate-900/20 border-t border-white/20 dark:border-slate-700/40 py-6 sm:py-8 px-4"
      suppressHydrationWarning
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-4 sm:gap-6">

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
              <Image src="/logo.svg" alt="Mindbridge IA Logo" width={56} height={56} className="object-contain" />
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} Mindbridge IA. {t("footer_rights")}
            </p>
          </div>

          {/* Email e Instagram */}
          <div className="flex items-center gap-4">
            <a
              href="mailto:juangutierrezdelaconcha@mindbride.net"
              className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 hover:text-emerald-500 transition-colors"
            >
              juangutierrezdelaconcha@mindbride.net
            </a>
            <a
              href="https://instagram.com/mindbridgeia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 hover:text-emerald-500 transition-colors"
            >
              @mindbridgeia
            </a>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
            <Link href="#servicios" className="hover:text-emerald-500 transition-colors py-1 px-2 -mx-2 min-h-[32px] flex items-center">
              {t("footer_link_web")}
            </Link>
            <Link href="#demo" className="hover:text-emerald-500 transition-colors py-1 px-2 -mx-2 min-h-[32px] flex items-center">
              {t("footer_link_ai")}
            </Link>
            <Link href="#servicios" className="hover:text-emerald-500 transition-colors py-1 px-2 -mx-2 min-h-[32px] flex items-center">
              {t("footer_link_auto")}
            </Link>
            <Link href="#contacto" className="hover:text-emerald-500 transition-colors py-1 px-2 -mx-2 min-h-[32px] flex items-center">
              {t("footer_link_consulting")}
            </Link>
            <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">|</span>
            <Link href="/aviso-legal" className="hover:text-emerald-500 transition-colors py-1 px-2 -mx-2 min-h-[32px] flex items-center">
              Aviso Legal
            </Link>
            <Link href="/privacidad" className="hover:text-emerald-500 transition-colors py-1 px-2 -mx-2 min-h-[32px] flex items-center">
              Privacidad
            </Link>
            <Link href="/cookies" className="hover:text-emerald-500 transition-colors py-1 px-2 -mx-2 min-h-[32px] flex items-center">
              Cookies
            </Link>
            <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">|</span>
            <Link href="/admin/login" className="hover:text-emerald-500 transition-colors py-1 px-2 -mx-2 min-h-[32px] flex items-center opacity-10 hover:opacity-60">
              ⚙
            </Link>
          </nav>

        </div>
      </div>
    </footer>
  );
}
