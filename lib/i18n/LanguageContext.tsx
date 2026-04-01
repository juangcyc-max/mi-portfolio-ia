"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { LangCode, LANGUAGES, getLang } from "./languages";
import { UIStrings, ES_STRINGS, STATIC_TRANSLATIONS } from "./strings";

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

function detectBrowserLang(): LangCode {
  if (typeof navigator === "undefined") return "es";
  const raw = navigator.language?.split("-")[0] as LangCode;
  const supported = LANGUAGES.map((l) => l.code);
  return supported.includes(raw) ? raw : "es";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("es");
  const [translations, setTranslations] = useState<UIStrings>(ES_STRINGS);
  const [isTranslating, setIsTranslating] = useState(false);

  // Detect browser language on first mount
  useEffect(() => {
    const stored = localStorage.getItem("mindbridge_lang") as LangCode | null;
    const initial = stored ?? detectBrowserLang();
    if (initial !== "es") {
      applyLang(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyLang = useCallback(async (newLang: LangCode) => {
    setLangState(newLang);
    localStorage.setItem("mindbridge_lang", newLang);

    // Apply RTL if needed
    const langMeta = getLang(newLang);
    document.documentElement.dir = langMeta.rtl ? "rtl" : "ltr";
    document.documentElement.lang = newLang;

    // Static translations (es / en)
    if (STATIC_TRANSLATIONS[newLang]) {
      setTranslations(STATIC_TRANSLATIONS[newLang] as UIStrings);
      return;
    }

    // Check localStorage cache
    const cacheKey = `mindbridge_t_${newLang}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        setTranslations(JSON.parse(cached));
        return;
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }

    // Fetch translation from API
    setIsTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetLang: newLang, strings: ES_STRINGS }),
      });
      if (res.ok) {
        const data = await res.json();
        setTranslations(data.translations);
        localStorage.setItem(cacheKey, JSON.stringify(data.translations));
      }
    } catch (err) {
      console.warn("Translation failed, falling back to Spanish:", err);
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const setLang = useCallback(
    (newLang: LangCode) => {
      applyLang(newLang);
    },
    [applyLang]
  );

  const t = useCallback(
    (key: keyof UIStrings): string => {
      return (translations[key] as string) ?? (ES_STRINGS[key] as string);
    },
    [translations]
  );

  const isRTL = getLang(lang).rtl ?? false;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isTranslating, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}
