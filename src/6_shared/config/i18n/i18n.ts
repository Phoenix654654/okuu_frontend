import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const LANGUAGE_KEY = "i18nextLng";

export const getStoredLanguage = (): string => {
    return sessionStorage.getItem(LANGUAGE_KEY) || "ru";
};

export const setStoredLanguage = (lng: string): void => {
    sessionStorage.setItem(LANGUAGE_KEY, lng);
};

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: getStoredLanguage(),
        fallbackLng: "ru",
        supportedLngs: ["ru", "kg"],
        debug: import.meta.env.DEV,
        ns: ["common"],
        defaultNS: "common",
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
        detection: {
            order: ["sessionStorage", "navigator"],
            caches: ["sessionStorage"],
        },
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: true,
        },
    });

i18n.on("languageChanged", (lng) => {
    setStoredLanguage(lng);
    window.dispatchEvent(new Event('languageChanged'));
});

export default i18n;
