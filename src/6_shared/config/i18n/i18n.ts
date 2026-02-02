import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

const LANGUAGE_KEY = "i18nextLng";

export const getStoredLanguage = (): string => {
    return sessionStorage.getItem(LANGUAGE_KEY) || "ru";
};

export const setStoredLanguage = (lng: string): void => {
    sessionStorage.setItem(LANGUAGE_KEY, lng);
};

i18n.use(Backend)
    .use(initReactI18next)
    .init({
        lng: getStoredLanguage(),
        fallbackLng: "ru",
        debug: false,
        ns: ["common"],
        defaultNS: "common",
        partialBundledLanguages: true,
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
        interpolation: {
            escapeValue: false,
        },
    });

i18n.on("languageChanged", (lng) => {
    setStoredLanguage(lng);
});

export default i18n;
