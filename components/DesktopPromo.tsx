"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const FEATURES = [
  {
    key: "desktop_f1" as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    key: "desktop_f2" as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    ),
  },
  {
    key: "desktop_f3" as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    key: "desktop_f4" as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function DesktopPromo() {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-6xl mx-auto">

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left — text */}
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 dark:border-emerald-400/20 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              {t("desktop_badge")}
            </span>

            <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-4 text-slate-900 dark:text-white">
              {t("desktop_title1")}<br />
              <span className="text-emerald-500 dark:text-emerald-400">{t("desktop_title2")}</span>
            </h2>

            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-8 max-w-md">
              {t("desktop_subtitle")}
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center gap-2 bg-white/60 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/10 rounded-xl px-4 py-2.5 backdrop-blur-sm">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{t("desktop_free")}</p>
                  <p className="text-slate-400 text-xs">{t("desktop_free_desc")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/60 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/10 rounded-xl px-4 py-2.5 backdrop-blur-sm">
                <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                </svg>
                <div>
                  <p className="text-slate-700 dark:text-slate-200 font-bold text-sm">{t("desktop_from")}</p>
                  <p className="text-slate-400 text-xs">{t("desktop_windows")}</p>
                </div>
              </div>
            </div>

            <Link
              href="/desktop"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-7 py-3.5 rounded-2xl transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t("desktop_cta")}
            </Link>
          </motion.div>

          {/* Right — feature grid */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(({ key, icon }) => (
              <div
                key={key}
                className="group flex items-start gap-3 bg-white/60 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/10 rounded-2xl p-5 backdrop-blur-sm hover:border-emerald-500/40 dark:hover:border-emerald-400/40 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-white/5 border border-emerald-500/20 dark:border-white/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  {icon}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-snug mt-1.5">{t(key)}</p>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
