import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import locales_ru from "./locales/ru.json";
import locales_en from "./locales/en.json";
import {helperLanguage} from "../helpers/helperLanguage";
import {DEFAULT_LANGUAGE} from "../constanst/vars";

const resources = {
    ru: locales_ru,
    en: locales_en,
}

const [lang] = helperLanguage(DEFAULT_LANGUAGE)

i18n.use(initReactI18next).init({
    fallbackLng: DEFAULT_LANGUAGE || "en",
    lng: lang,
    resources,
    ns: ['translations'],
    defaultNS: 'translations',
    react: {
        useSuspense: false
    }
});
