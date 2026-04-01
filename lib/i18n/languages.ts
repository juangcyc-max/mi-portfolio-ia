export type LangCode =
  | "es" | "en" | "fr" | "de" | "pt" | "it" | "nl" | "ru"
  | "zh" | "ja" | "ko" | "ar" | "hi" | "tr" | "pl" | "sv"
  | "da" | "no" | "fi" | "el" | "cs" | "ro" | "hu" | "bg"
  | "hr" | "sk" | "uk" | "he" | "th" | "vi" | "id" | "ms"
  | "ca" | "gl" | "eu" | "sw" | "lt" | "lv" | "et" | "sl";

export interface Language {
  code: LangCode;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

export const LANGUAGES: Language[] = [
  { code: "es", name: "Spanish",    nativeName: "Español",     flag: "🇪🇸" },
  { code: "en", name: "English",    nativeName: "English",     flag: "🇬🇧" },
  { code: "fr", name: "French",     nativeName: "Français",    flag: "🇫🇷" },
  { code: "de", name: "German",     nativeName: "Deutsch",     flag: "🇩🇪" },
  { code: "pt", name: "Portuguese", nativeName: "Português",   flag: "🇵🇹" },
  { code: "it", name: "Italian",    nativeName: "Italiano",    flag: "🇮🇹" },
  { code: "nl", name: "Dutch",      nativeName: "Nederlands",  flag: "🇳🇱" },
  { code: "ru", name: "Russian",    nativeName: "Русский",     flag: "🇷🇺" },
  { code: "zh", name: "Chinese",    nativeName: "中文",          flag: "🇨🇳" },
  { code: "ja", name: "Japanese",   nativeName: "日本語",         flag: "🇯🇵" },
  { code: "ko", name: "Korean",     nativeName: "한국어",          flag: "🇰🇷" },
  { code: "ar", name: "Arabic",     nativeName: "العربية",      flag: "🇸🇦", rtl: true },
  { code: "hi", name: "Hindi",      nativeName: "हिन्दी",        flag: "🇮🇳" },
  { code: "tr", name: "Turkish",    nativeName: "Türkçe",      flag: "🇹🇷" },
  { code: "pl", name: "Polish",     nativeName: "Polski",      flag: "🇵🇱" },
  { code: "sv", name: "Swedish",    nativeName: "Svenska",     flag: "🇸🇪" },
  { code: "da", name: "Danish",     nativeName: "Dansk",       flag: "🇩🇰" },
  { code: "no", name: "Norwegian",  nativeName: "Norsk",       flag: "🇳🇴" },
  { code: "fi", name: "Finnish",    nativeName: "Suomi",       flag: "🇫🇮" },
  { code: "el", name: "Greek",      nativeName: "Ελληνικά",    flag: "🇬🇷" },
  { code: "cs", name: "Czech",      nativeName: "Čeština",     flag: "🇨🇿" },
  { code: "ro", name: "Romanian",   nativeName: "Română",      flag: "🇷🇴" },
  { code: "hu", name: "Hungarian",  nativeName: "Magyar",      flag: "🇭🇺" },
  { code: "bg", name: "Bulgarian",  nativeName: "Български",   flag: "🇧🇬" },
  { code: "hr", name: "Croatian",   nativeName: "Hrvatski",    flag: "🇭🇷" },
  { code: "sk", name: "Slovak",     nativeName: "Slovenčina",  flag: "🇸🇰" },
  { code: "uk", name: "Ukrainian",  nativeName: "Українська",  flag: "🇺🇦" },
  { code: "he", name: "Hebrew",     nativeName: "עברית",        flag: "🇮🇱", rtl: true },
  { code: "th", name: "Thai",       nativeName: "ภาษาไทย",      flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt",  flag: "🇻🇳" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ms", name: "Malay",      nativeName: "Bahasa Melayu",   flag: "🇲🇾" },
  { code: "ca", name: "Catalan",    nativeName: "Català",      flag: "🏴" },
  { code: "gl", name: "Galician",   nativeName: "Galego",      flag: "🏴" },
  { code: "eu", name: "Basque",     nativeName: "Euskara",     flag: "🏴" },
  { code: "sw", name: "Swahili",    nativeName: "Kiswahili",   flag: "🇰🇪" },
  { code: "lt", name: "Lithuanian", nativeName: "Lietuvių",    flag: "🇱🇹" },
  { code: "lv", name: "Latvian",    nativeName: "Latviešu",    flag: "🇱🇻" },
  { code: "et", name: "Estonian",   nativeName: "Eesti",       flag: "🇪🇪" },
  { code: "sl", name: "Slovenian",  nativeName: "Slovenščina", flag: "🇸🇮" },
];

export const getLang = (code: LangCode) =>
  LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
