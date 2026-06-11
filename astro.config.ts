import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import compressor from 'astro-compressor';

export default defineConfig({
  output: 'static',
  site: 'https://koalastuff.net',
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
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
        },
      },
    }),
    compressor({
      gzip: true,
      brotli: true,
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'pt', 'tr', 'ja', 'ko', 'zh', 'uk'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
