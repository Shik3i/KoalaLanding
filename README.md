# KoalaStuff Landing Page

The official landing page for [koalastuff.net](https://koalastuff.net) — a central hub introducing all KoalaStuff projects, linking to their websites, stores, and repositories.

## Tech Stack

- **[Astro](https://astro.build)** — static site generator with built-in i18n routing
- **TypeScript** — strict mode, no `any`
- **Plain CSS** — no Tailwind, no frameworks; CSS custom properties for theming
- **Output** — 100% static HTML, no runtime server required
- **Fonts** — self-hosted Inter (woff2), no external font providers
- **Assets** — all images and fonts served from the repo, no CDN

## Requirements

- Node.js 18+
- npm 9+

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Build

```bash
npm run build
```

Generates a static `dist/` directory. No Node.js runtime is needed in production.

## Preview Built Site

```bash
npm run preview
```

Serves the `dist/` directory locally for a production-equivalent check.

## Deployment (Caddy on VPS)

Expected deployment flow:

```bash
# On the VPS, in the repo directory:
git pull
npm install  # only needed when package.json changes
npm run build
# Caddy serves dist/ directly — no restart needed
```

### Example Caddyfile

```caddyfile
koalastuff.net {
    root * /srv/koalastuff.net/dist
    encode zstd gzip
    file_server

    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
        X-Frame-Options "DENY"
        Permissions-Policy "accelerometer=(), ambient-light-sensor=(), autoplay=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), usb=(), web-share=(), xr-spatial-tracking=()"
        Cross-Origin-Opener-Policy "same-origin"
        Cross-Origin-Resource-Policy "same-origin"
        Content-Security-Policy "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'sha256-08Vb/IOCwmQ3F7ohGRxyjJteaJqilGy3MO2Xv0Y3dsw='; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; manifest-src 'self'; worker-src 'self'; upgrade-insecure-requests"
    }
}
```

### CSP and the Anti-Flash Inline Script

The site uses a single tiny inline script in `<head>` to prevent a flash-of-wrong-theme before JavaScript loads. This is the **only** inline script on the site.

To use a strict `script-src 'self'` CSP, you must add the SHA-256 hash of this script to the Caddy config.

The anti-flash script hash is:

```
sha256-08Vb/IOCwmQ3F7ohGRxyjJteaJqilGy3MO2Xv0Y3dsw=
```

Use in the Caddy CSP: `script-src 'self' 'sha256-08Vb/IOCwmQ3F7ohGRxyjJteaJqilGy3MO2Xv0Y3dsw='`

If you ever change the inline script in `src/layouts/BaseLayout.astro`, recompute the hash:

```powershell
# PowerShell:
$script = "(function()...your script...)()"
$bytes = [System.Text.Encoding]::UTF8.GetBytes($script)
$sha256 = [System.Security.Cryptography.SHA256]::Create()
$b64 = [Convert]::ToBase64String($sha256.ComputeHash($bytes))
echo "sha256-$b64"
```

```bash
# Linux/macOS:
echo -n '(function(){...})();' | openssl dgst -sha256 -binary | base64
```

---

## How to Add a Project

1. Open [`src/data/projects.ts`](src/data/projects.ts)
2. Add a new entry to the `projects` array following the `Project` type
3. Set `listed: true` to show it on the site, `listed: false` to keep it in the data only
4. Set `featured: true` to show it as a large showcase block (max 2–3 featured)
5. Set `homepage: true` to display it on the homepage, or `false` to display it only on `/projects/`
6. Add translations to `src/i18n/locales/en.json` and `src/i18n/locales/de.json` (other locales fall back to English)
7. Copy project assets to `src/assets/projects/<project-id>/` so the Astro build can optimize them automatically

## How to Add Assets

1. Copy files to `src/assets/projects/<project-id>/` or `src/assets/brand/`
2. Astro will automatically optimize raster images (PNG, WebP, JPEG) into WebP/AVIF formats with 1x and 2x density variants.
3. SVGs are served directly without processing.

## How to Add or Update Translations

1. Edit `src/i18n/locales/en.json` for English (source of truth)
2. Edit `src/i18n/locales/de.json` for German
3. For other languages, copy keys from `en.json` and translate values
4. All 13 locale files exist in `src/i18n/locales/`:
   `en`, `de`, `fr`, `es`, `it`, `nl`, `pl`, `pt`, `tr`, `ja`, `ko`, `zh`, `uk`
5. Missing keys automatically fall back to English

## How to Update Legal Pages

Legal pages are in `src/pages/`:
- `privacy/index.astro` — English privacy policy
- `imprint/index.astro` — English imprint
- `de/datenschutz/index.astro` — German Datenschutzerklärung (DSGVO)
- `de/impressum/index.astro` — German Impressum (§ 5 DDG)

---

## Security Notes

### No External Dependencies in Production

The built site has **zero external network requests**:
- No external fonts (Inter is self-hosted in `src/assets/fonts/`)
- No external scripts (all JS is bundled by Astro)
- No external stylesheets
- No analytics, tracking, or cookies
- No external images or CDN resources

### CSP Compatibility

The site is designed for a strict Content Security Policy. The only exception is the anti-flash theme script (see above). All other JS is served from `'self'`.

Avoid these patterns to maintain CSP compatibility:
- No `onclick=""` or other inline event handlers
- No `eval()`, `new Function()`, or dynamic script injection
- No external embeds or iframes

### localStorage Usage

The theme toggle stores the user's preference in `localStorage` under the key `koala-theme`. This is:
- A local storage value only — it never leaves the browser
- Not transmitted anywhere
- Not a cookie
- Disclosed in the privacy policy and on legal pages

---

## Project Structure

```
KoalaLanding/
├── astro.config.ts        # Astro configuration (i18n, sitemap, static output)
├── tsconfig.json          # TypeScript configuration
├── public/                # Static assets served as-is (robots.txt, favicon.svg)
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro   # Base HTML shell with SEO, hreflang, anti-flash
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ProjectCard.astro
│   │   └── sections/
│   │       ├── Hero.astro
│   │       ├── Projects.astro
│   │       ├── FeaturedProjectBlock.astro
│   │       ├── About.astro
│   │       ├── Trust.astro
│   │       ├── DevNotes.astro
│   │       └── FAQ.astro
│   ├── assets/            # Project icons, mascots, brand assets (optimized at build)
│   ├── data/
│   │   └── projects.ts    # Project data (edit to add/update projects)
│   ├── i18n/
│   │   ├── config.ts      # Locale list, names, path helpers
│   │   ├── utils.ts       # Translation loader with fallback
│   │   └── locales/       # JSON translation files (en, de, fr, ...)
│   ├── scripts/
│   │   └── theme.ts       # Theme toggle, language switcher, mobile nav
│   └── styles/
│       ├── global.css     # CSS custom properties, resets, typography, utilities
│       └── components.css # Header, footer, hero, cards, FAQ, etc.
└── dist/                  # Build output (git-ignored, served by Caddy)
```

## Performance Notes

- Fonts are preloaded with `<link rel="preload">` for LCP optimization
- Images use `loading="lazy"` and `decoding="async"` except above-the-fold content
- No heavy animation libraries — CSS animations only, with `prefers-reduced-motion` support
- Minimal JavaScript — one bundled module (theme + UI interactions)
- All CSS is inlined by Astro into a single hashed file

## TODO Checklist Before Going Live

- [ ] Add KoalaClicker store links when available
- [ ] Add screenshots/visuals for project showcase blocks
