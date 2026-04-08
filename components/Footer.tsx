"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
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
          <div className="flex items-center gap-6">
            <a
              href="mailto:juangutierrezdelaconcha@mindbride.net"
              className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-400 hover:text-emerald-500 transition-colors"
            >
              <Mail size={16} />
              juangutierrezdelaconcha@mindbride.net
            </a>
            <a
              href="https://instagram.com/mindbridgeia"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-400 hover:text-emerald-500 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              @mindbridgeia
            </a>
            <a
              href="https://wa.me/34613096449"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-400 hover:text-emerald-500 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <a
              href="https://t.me/Mindbrige_IA_Bot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-400 hover:text-emerald-500 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              Telegram
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
