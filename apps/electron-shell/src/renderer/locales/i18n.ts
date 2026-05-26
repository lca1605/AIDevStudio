import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enCommon from "./en/common.json";
import viCommon from "./vi/common.json";

i18n.use(initReactI18next).init({
  lng: localStorage.getItem("ide-settings")
    ? JSON.parse(localStorage.getItem("ide-settings")!).state?.language ?? "en"
    : "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  resources: {
    en: { common: enCommon },
    vi: { common: viCommon },
  },
  defaultNS: "common",
});

export default i18n;
