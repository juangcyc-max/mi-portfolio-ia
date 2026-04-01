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

type LangCode = "es" | "en";

interface LanguageContextValue {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: (key: keyof UIStrings) => string;
  isTranslating: boolean;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "es",
  setLang: () => {},
  t: (key) => ES_STRINGS[key] as string,
  isTranslating: false,
  isRTL: false,
});

export function useTranslation() {
  return useContext(LanguageContext);
}

const STRINGS: Record<LangCode, UIStrings> = {
  es: ES_STRINGS,
  en: EN_STRINGS,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("es");

  // Detect stored or browser language on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mindbridge_lang") as LangCode | null;
      if (stored === "es" || stored === "en") {
        setLangState(stored);
      } else {
        // Detect from browser
        const raw = navigator.language?.split("-")[0];
        if (raw === "en") setLangState("en");
        // Default is "es"
      }
    } catch {
      // localStorage not available (SSR)
    }
  }, []);

  const setLang = useCallback((newLang: LangCode) => {
    setLangState(newLang);
    try {
      localStorage.setItem("mindbridge_lang", newLang);
      document.documentElement.lang = newLang;
      document.documentElement.dir = "ltr";
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key: keyof UIStrings): string => {
      return ((STRINGS[lang][key] as string) || (ES_STRINGS[key] as string)) ?? String(key);
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isTranslating: false, isRTL: false }}>
      {children}
    </LanguageContext.Provider>
  );
}
