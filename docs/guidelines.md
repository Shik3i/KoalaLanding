# KoalaStuff — Architecture & Guidelines

This document outlines the architectural rules, coding standards, and guidelines for maintaining the KoalaStuff Landing Page.

## Technology Stack
- **Astro v6**: Set up in strict static HTML generation mode.
- **TypeScript**: Strict configurations, with `noImplicitAny` and strict null checking enabled.
- **Vanilla CSS**: Kept framework-free (no TailwindCSS/Bootstrap). Layouts use CSS Grid, Flexbox, and HSL custom property mappings.
- **Locales**: Dynamic translation loaders supporting 13 localized paths: `en`, `de`, `fr`, `es`, `it`, `nl`, `pl`, `pt`, `tr`, `ja`, `ko`, `zh`, `uk`.

---

## Coding Guidelines

### 1. Adding New Projects
- Do not hardcode project cards in HTML/Astro. All additions must be made inside [`src/data/projects.ts`](file:///c:/Users/s3ish/Documents/Workspace/KoalaLanding/src/data/projects.ts).
- Project icons and mascots must be placed in `src/assets/projects/` to be picked up by the automatic optimization pipeline.
- Set `homepage: true` for curated standard homepage projects (e.g. KoalaPull, KoalaSnippets, KoalaWeb).
- Set `homepage: false` for work-in-progress, experimental, or dashboard projects to restrict them to the tracker-style `/projects/` page.

### 2. Privacy-First Principles
- No cookies may be introduced.
- No third-party scripts (e.g. Google Tag Manager, CDNs, external widgets) are permitted.
- The site uses `localStorage` only to persist the user's color theme preference locally. This must be disclosed in the privacy policy.
- Legal pages (privacy policy and imprint) must use plain, non-commercial German and English legal wording matching the private hobby status of the developer.

### 3. Build & Deployment Checks
Before pushing to production, always run:
```bash
npm run build
```
Ensure that:
1. All 30 routes compile cleanly.
2. Raster images are generated as AVIF/WebP in the build cache.
3. No console type check errors exist.
4. Outbound links preserve correct localized base paths (e.g., `/de/projects` vs `/projects`).
