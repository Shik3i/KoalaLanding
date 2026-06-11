export const locales = [
  'en', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'pt', 'tr', 'ja', 'ko', 'zh', 'uk',
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: '🇺🇸 English',
  de: '🇩🇪 Deutsch',
  fr: '🇫🇷 Français',
  es: '🇪🇸 Español',
  it: '🇮🇹 Italiano',
  nl: '🇳🇱 Nederlands',
  pl: '🇵🇱 Polski',
  pt: '🇵🇹 Português',
  tr: '🇹🇷 Türkçe',
  ja: '🇯🇵 日本語',
  ko: '🇰🇷 한국어',
  zh: '🇨🇳 中文',
  uk: '🇺🇦 Українська',
};

export const localeLangCodes: Record<Locale, string> = {
  en: 'en',
  de: 'de',
  fr: 'fr',
  es: 'es',
  it: 'it',
  nl: 'nl',
  pl: 'pl',
  pt: 'pt',
  tr: 'tr',
  ja: 'ja',
  ko: 'ko',
  zh: 'zh',
  uk: 'uk',
};

export function getLocalePath(locale: Locale, path: string = ''): string {
  const base = locale === defaultLocale ? '' : `/${locale}`;
  return `${base}/${path}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
}
