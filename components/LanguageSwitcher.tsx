"use client";

import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();

  return (
    <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-white/10 rounded-xl p-0.5">
      <button
        onClick={() => setLang("es")}
        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
          lang === "es"
            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
      >
        🇪🇸 ES
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
          lang === "en"
            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
      >
        🇬🇧 EN
      </button>
    </div>
  );
}
