"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const FEATURES = [
  { icon: "🤖", key: "desktop_f1" as const },
  { icon: "🖥️", key: "desktop_f2" as const },
  { icon: "🖼️", key: "desktop_f3" as const },
  { icon: "⏰", key: "desktop_f4" as const },
];

export default function DesktopPromo() {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-6xl mx-auto">

        <div className="rounded-3xl bg-slate-950 dark:bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">

            {/* Left */}
            <div className="p-10 sm:p-14 flex flex-col justify-center">
              <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 w-fit">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                {t("desktop_badge")}
              </span>

              <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
                {t("desktop_title1")}<br />
                <span className="text-emerald-400">{t("desktop_title2")}</span>
              </h2>

              <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-md">
                {t("desktop_subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-3">
                  <span className="text-2xl">🎁</span>
                  <div>
                    <p className="text-emerald-400 font-bold text-sm">{t("desktop_free")}</p>
                    <p className="text-slate-500 text-xs">{t("desktop_free_desc")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="text-white font-bold text-sm">{t("desktop_from")}</p>
                    <p className="text-slate-500 text-xs">{t("desktop_windows")}</p>
                  </div>
                </div>
              </div>

              <Link
                href="/desktop"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-7 py-3.5 rounded-2xl transition-colors text-sm w-fit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {t("desktop_cta")}
              </Link>
            </div>

            {/* Right */}
            <div className="bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-10 sm:p-14 flex flex-col justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FEATURES.map(({ icon, key }) => (
                  <div key={key} className="flex items-start gap-3 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
                    <span className="text-2xl shrink-0">{icon}</span>
                    <p className="text-slate-300 text-sm font-medium leading-snug">{t(key)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3 border border-slate-700 rounded-2xl px-5 py-3">
                <svg className="w-8 h-8 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                </svg>
                <p className="text-slate-500 text-xs">{t("desktop_windows")}</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
