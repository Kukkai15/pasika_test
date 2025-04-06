import { createI18n } from 'vue-i18n';

import enMSg from './lang/en/en';
import thMsg from './lang/th/th';

export const defaultLang = 'th';

const messages = {
    en: {
        ...enMSg
    },
    th: {
        ...thMsg
    }
};

const i18n = createI18n({
    silentTranslationWarn: true,
    legacy: false,
    locale: defaultLang,
    fallbackLocale: defaultLang,
    messages
});

export function setI18nLanguage(lang) {
    i18n.locale = lang;
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
}

export function i18nRender(key) {
    return i18n.global.t(`${key}`);
}

export default i18n;
