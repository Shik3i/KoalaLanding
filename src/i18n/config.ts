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
  // Normalize the input path to strip leading/trailing slashes for route matching
  const cleanPath = path.replace(/^\/+/, '').replace(/\/+$/, '');

  // Identify if the page is a legal/special page
  const isPrivacy = cleanPath === 'privacy' || cleanPath === 'de/datenschutz' || cleanPath === 'datenschutz';
  const isImprint = cleanPath === 'imprint' || cleanPath === 'de/impressum' || cleanPath === 'impressum';

  if (isPrivacy) {
    if (locale === 'de') {
      return '/de/datenschutz/';
    } else {
      return '/privacy/'; // No localized prefix for other languages (e.g. /fr/privacy doesn't exist)
    }
  }

  if (isImprint) {
    if (locale === 'de') {
      return '/de/impressum/';
    } else {
      return '/imprint/'; // No localized prefix for other languages
    }
  }

  // Default routing for normal pages
  const base = locale === defaultLocale ? '' : `/${locale}`;
  return `${base}/${path}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
}
