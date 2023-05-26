import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import nl from "./locales/nl.json";

export const defaultNS = "ns1";

export const resources = {
  en: { ns1: en },
  fr: { ns1: fr },
  nl: { ns1: nl },
} as const;

export enum Languages {
  Auto = "Auto",
  EN = "English",
  FR = "French",
  NL = "Dutch",
}

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: "en",
    ns: ["ns1"],
    defaultNS,
    resources,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      caches: [],
    },
  });
