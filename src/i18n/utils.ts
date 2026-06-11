import type { Locale } from './config';
import { defaultLocale } from './config';

// Locale files are loaded via static imports to avoid runtime fetching
const localeModules = {
  en: () => import('./locales/en.json'),
  de: () => import('./locales/de.json'),
  fr: () => import('./locales/fr.json'),
  es: () => import('./locales/es.json'),
  it: () => import('./locales/it.json'),
  nl: () => import('./locales/nl.json'),
  pl: () => import('./locales/pl.json'),
  pt: () => import('./locales/pt.json'),
  tr: () => import('./locales/tr.json'),
  ja: () => import('./locales/ja.json'),
  ko: () => import('./locales/ko.json'),
  zh: () => import('./locales/zh.json'),
  uk: () => import('./locales/uk.json'),
};

type TranslationDict = Record<string, string>;

const cache: Partial<Record<Locale, TranslationDict>> = {};

export async function loadTranslations(locale: Locale): Promise<TranslationDict> {
  if (cache[locale]) return cache[locale]!;
  try {
    const mod = await localeModules[locale]();
    cache[locale] = mod.default as TranslationDict;
  } catch {
    const fallback = await localeModules[defaultLocale]();
    cache[locale] = fallback.default as TranslationDict;
  }
  return cache[locale]!;
}

export function t(translations: TranslationDict, key: string, fallback?: string): string {
  return translations[key] ?? fallback ?? key;
}
