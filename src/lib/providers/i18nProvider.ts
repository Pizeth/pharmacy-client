// src/providers/i18nProvider.ts
import type { I18nProvider } from "@refinedev/core";
import i18n from "../i18n/i18n";
// import i18n from "@/lib/i18n";

export const i18nProvider: I18nProvider = {
  translate: (key, options) => i18n.t(key, options) as string,
  changeLocale: async (lang) => {
    await i18n.changeLanguage(lang);
  },
  getLocale: () => i18n.language,
};
