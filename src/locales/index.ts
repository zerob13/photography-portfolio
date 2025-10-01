import { createI18n } from 'vue-i18n';

export const supportedLocales = ['zh', 'en'] as const;
export type SupportedLocale = (typeof supportedLocales)[number];
export const defaultLocale: SupportedLocale = 'zh';

const loadedLocales = new Set<string>();

const localeLoaders: Record<SupportedLocale, () => Promise<{ default: Record<string, unknown> }>> = {
  zh: () => import('./zh.json'),
  en: () => import('./en.json')
};

export const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  messages: {}
});

export async function loadLocaleMessages(locale: SupportedLocale) {
  if (loadedLocales.has(locale)) {
    return;
  }

  const loader = localeLoaders[locale];
  if (!loader) return;

  const messages = await loader();
  i18n.global.setLocaleMessage(locale, messages.default);
  loadedLocales.add(locale);
}

export async function setLocale(locale: SupportedLocale) {
  await loadLocaleMessages(locale);
  i18n.global.locale.value = locale;
  document.documentElement.setAttribute('lang', locale);
}
