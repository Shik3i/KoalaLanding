# KoalaStuff — Agent Development Log

This document serves as a developer log outlining the context, engineering constraints, and guidelines for managing the KoalaStuff Landing Page repository.

## Project Context
KoalaStuff is a curated hub of open-source utilities, browser extensions, and web tools built by Timo (KoalaDev) to address real-world annoyances. Unlike typical SaaS landing pages, this repository is designed to be a lightweight, highly trustworthy, and beautiful static representation of the KoalaStuff universe.

## Core Core Engineering Constraints

### 1. Security & Strict Content Security Policy (CSP)
To ensure the landing page remains secure and fast, it is built to support a strict CSP:
- **No external scripts, stylesheets, or fonts**: Every asset is bundled locally. Fonts (Inter) are preloaded and served directly.
- **No inline script or style tag violations**: All CSS is processed by Astro and outputted as hashed external files. The *only* inline block allowed is the tiny anti-flash script in `<head>`, which is verified against a strict SHA-256 hash in the configuration:
  - Hash: `sha256-08Vb/IOCwmQ3F7ohGRxyjJteaJqilGy3MO2Xv0Y3dsw=`
- **No inline event handlers**: Handlers like `onclick`, `onload`, or `onerror` are strictly prohibited. All element events must be registered dynamically via JS classes.

### 2. High Performance & Page Speed
- **Static Output**: The project compiles to 100% static HTML (`output: 'static'` in Astro). No runtime server node layer is required in production.
- **Asset preloading**: Woff2 font variants are preloaded in `<head>` to minimize layout shifts.
- **Optimized Image Pipeline**: Raster assets are stored in `src/assets` and compiled dynamically using Astro's `<Picture>` component into responsive **AVIF** and **WebP** types with **1x/2x densities** (`densities={[1, 2]}`) to support high-DPI retina displays.

### 3. Aesthetics & Design System
- **Curated Accents**: Uses CSS custom properties and HSL-based color schemas.
- **Interactive Micro-animations**: Employs mouse-reactive gradients, glowing cards, glassmorphic header backdrops (`backdrop-filter: blur`), and responsive grid layouts.

## Directory Layout
- `/src/assets/`: Contains project logos, icons, mascots, and fonts.
- `/src/data/projects.ts`: The central database containing project metadata, release dates, and links.
- `/src/i18n/`: Hand-crafted translation modules for 13 locales.
- `/src/pages/`: Page routing templates, including the dedicated `/projects/` tracker log.
