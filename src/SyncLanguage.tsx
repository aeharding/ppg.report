import { useTranslation } from "react-i18next";
import { useAppSelector } from "./hooks";
import { useEffect } from "react";
import { Languages } from "./i18n";

function getLanguageCode(language: Languages): string | null {
  switch (language) {
    case Languages.Auto:
      return null;
    case Languages.EN:
      return "en";
    case Languages.FR:
      return "fr";
    case Languages.NL:
      return "nl";
  }
}

export default function SyncLanguage() {
  const { i18n } = useTranslation();
  const language = useAppSelector((state) => state.user.language);

  useEffect(() => {
    i18n.changeLanguage(getLanguageCode(language) || undefined);
  }, [language, i18n]);

  return <></>;
}
