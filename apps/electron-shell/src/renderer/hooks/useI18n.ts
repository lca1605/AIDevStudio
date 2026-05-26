import { useTranslation } from "react-i18next";
import { useSettingsStore } from "../stores/settings.store";
import i18n from "../locales/i18n";

export function useI18n() {
  const { t } = useTranslation("common");
  const { language, setLanguage } = useSettingsStore();

  const changeLanguage = (lang: "en" | "vi") => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return { t, language, changeLanguage };
}
