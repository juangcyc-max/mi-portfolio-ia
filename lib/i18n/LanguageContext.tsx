"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { UIStrings, ES_STRINGS, EN_STRINGS } from "./strings";

export type LangCode = "es" | "en" | "zh";

const STATIC_LANGS: LangCode[] = ["es", "en"];

// Cache version tied to number of keys — auto-invalidates when strings are added
const CACHE_V = Object.keys(ES_STRINGS).length;

const LANG_NAMES: Record<LangCode, string> = {
  es: "Simplified Spanish",
  en: "English",
  zh: "Simplified Chinese (zh-CN)",
};

interface LanguageContextValue {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  prefetchLang: (lang: LangCode) => void;
  t: (key: keyof UIStrings) => string;
  isTranslating: boolean;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "es",
  setLang: () => {},
  prefetchLang: () => {},
  t: (key) => ES_STRINGS[key] as string,
  isTranslating: false,
  isRTL: false,
});

export function useTranslation() {
  return useContext(LanguageContext);
}

const STATIC_STRINGS: Record<string, UIStrings> = {
  es: ES_STRINGS,
  en: EN_STRINGS,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("es");
  const [dynamicStrings, setDynamicStrings] = useState<Record<string, string> | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Detect stored or browser language on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mindbridge_lang") as LangCode | null;
      if (stored && (["es", "en", "zh"] as LangCode[]).includes(stored)) {
        setLangState(stored);
      } else {
        const raw = navigator.language?.split("-")[0];
        if (raw === "en") setLangState("en");
      }
    } catch {}
  }, []);

  // Fetch dynamic translations when a non-static language is selected
  useEffect(() => {
    if (STATIC_LANGS.includes(lang)) {
      setDynamicStrings(null);
      return;
    }
    const cacheKey = `mindbridge_trans_${lang}_v${CACHE_V}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setDynamicStrings(JSON.parse(cached));
        return;
      }
    } catch {}

    setIsTranslating(true);
    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetLang: LANG_NAMES[lang], strings: ES_STRINGS }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.translations) {
          setDynamicStrings(data.translations);
          try { localStorage.setItem(cacheKey, JSON.stringify(data.translations)); } catch {}
        }
      })
      .catch(() => {})
      .finally(() => setIsTranslating(false));
  }, [lang]);

  const prefetchLang = useCallback((targetLang: LangCode) => {
    if (STATIC_LANGS.includes(targetLang)) return;
    const cacheKey = `mindbridge_trans_${targetLang}_v${CACHE_V}`;
    try { if (localStorage.getItem(cacheKey)) return; } catch {}
    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetLang: LANG_NAMES[targetLang], strings: ES_STRINGS }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.translations) {
          try { localStorage.setItem(cacheKey, JSON.stringify(data.translations)); } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const setLang = useCallback((newLang: LangCode) => {
    setLangState(newLang);
    try {
      localStorage.setItem("mindbridge_lang", newLang);
      document.documentElement.lang = newLang;
      document.documentElement.dir = "ltr";
    } catch {}
  }, []);

  const t = useCallback(
    (key: keyof UIStrings): string => {
      if (dynamicStrings) {
        return (dynamicStrings[key as string] || (ES_STRINGS[key] as string)) ?? String(key);
      }
      // While fetching a dynamic language, show EN (already translated) instead of ES
      if (isTranslating) {
        return (EN_STRINGS[key] as string) ?? (ES_STRINGS[key] as string) ?? String(key);
      }
      const strings = STATIC_STRINGS[lang] ?? ES_STRINGS;
      return ((strings[key] as string) || (ES_STRINGS[key] as string)) ?? String(key);
    },
    [lang, dynamicStrings, isTranslating]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, prefetchLang, t, isTranslating, isRTL: false }}>
      {children}
    </LanguageContext.Provider>
  );
}
