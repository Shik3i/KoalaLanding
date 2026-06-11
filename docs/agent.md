# KoalaStuff — Agent Development Log

This document serves as a developer log outlining the context, engineering constraints, and guidelines for managing the KoalaStuff Landing Page repository.

---

## 🐨 Project Context

KoalaStuff is a curated hub of open-source utilities, browser extensions, and web tools built by Timo (KoalaDev) to address real-world annoyances. Unlike typical SaaS landing pages, this repository is designed to be a lightweight, highly trustworthy, and beautiful static representation of the KoalaStuff universe.

---

## 🔒 Core Engineering Constraints

### 1. Security & Strict Content Security Policy (CSP)
To ensure the landing page remains secure and fast, it is built to support a strict CSP:
- **No external scripts, stylesheets, or CDNs**: Every asset is bundled locally. Fonts (Inter) are preloaded and served directly.
- **No inline script or style tag violations**: All CSS is processed by Astro and outputted as hashed external files. The *only* inline block allowed is the tiny anti-flash theme script in `<head>`, which is verified against a strict SHA-256 hash in the configuration:
  - Hash: `sha256-08Vb/IOCwmQ3F7ohGRxyjJteaJqilGy3MO2Xv0Y3dsw=`
- **No inline event handlers**: Handlers like `onclick`, `onload`, or `onerror` are strictly prohibited. All element events must be registered dynamically via JS classes.

### 2. High Performance & Page Speed
- **Static Output**: The project compiles to 100% static HTML (`output: 'static'` in Astro). No runtime server node layer is required in production.
- **Asset preloading**: Woff2 font variants are preloaded in `<head>` to minimize layout shifts.
- **Optimized Image Pipeline**: Raster assets are stored in `src/assets` and compiled dynamically using Astro's `<Picture>` component into responsive **AVIF** and **WebP** types with **1x/2x densities** (`densities={[1, 2]}`) to support high-DPI retina displays.

### 3. Aesthetics & Design System
- **Curated Accents**: Uses CSS custom properties and HSL-based color schemas.
- **Dynamic Organic Background**: Background blobs float and rotate smoothly inside an asymmetric morphing keyframe animation (`will-change: transform, border-radius` applied).
- **Featured mockup styling**: Wraps featured content in glassmorphic MacOS panel frames with mouse-reactive radial glows.
- **Browser-Specific Link Prioritization**: Uses client-side user agent detection to highlight and swap the order of Chrome and Firefox download buttons dynamically.

### 4. Work-in-Progress (WIP) Restrictions
- Projects with `status: 'wip'` represent unreleased software.
- The templates are set up to hide website, Chrome, and Firefox links automatically if the status is `'wip'`. Only stage code/GitHub buttons if they are present.

---

## 📁 Directory Layout
- `/src/assets/`: Contains project logos, icons, mascots, and fonts.
- `/src/data/projects.ts`: The central database containing project metadata, release dates, and links.
- `/src/i18n/`: Hand-crafted translation modules for 13 locales.
- `/src/pages/`: Page routing templates, including the dedicated `/projects/` tracker log and the `/blog/` MDX overview.
- `/src/content/blog/`: MDX files for blog posts, automatically synced via Astro's Content Collections.
