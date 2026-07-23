import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import compressor from 'astro-compressor';

import mdx from '@astrojs/mdx';

export default defineConfig({
  output: 'static',
  prefetch: true,
  site: 'https://koalastuff.net',
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
  integrations: [sitemap({
    filter: (page) => !page.endsWith('/imprint/') && !page.endsWith('/de/impressum/'),
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
  }), compressor({
    gzip: true,
    brotli: true,
  }), mdx()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'pt', 'tr', 'ja', 'ko', 'zh', 'uk'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
