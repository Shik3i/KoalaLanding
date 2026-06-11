<div align="center">
  <img src="./src/assets/brand/koalastuff-logo-128.png" alt="KoalaStuff Logo" width="128" />
  <h1>KoalaStuff Landing Page</h1>
  <p>The official landing page for <strong><a href="https://koalastuff.net">koalastuff.net</a></strong> — a highly curated, premium static hub introducing all KoalaStuff projects, browser utilities, and open-source applications.</p>

  <p>
    <a href="https://astro.build"><img src="https://img.shields.io/badge/Built%20with-Astro-ff5a03?style=for-the-badge&logo=astro&logoColor=white" alt="Built with Astro" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License MIT" /></a>
    <img src="https://img.shields.io/badge/Tracking-Zero-success?style=for-the-badge" alt="Zero Tracking" />
  </p>
</div>

> [!NOTE]
> This site is engineered to be 100% static, fast, private, and fully compliant with strict Content Security Policies (CSP). It serves as the single source of truth for the KoalaStuff software universe.

---

## 🚀 Technology Stack & Features

The project is built on modern web APIs and best practices:

*   **Framework**: [Astro v6](https://astro.build) configured in strict static mode (`output: 'static'`) with the new Content Layer API and `glob` loader.
*   **Routing**: Native SPA-like navigation using Astro's `<ClientRouter />` (View Transitions) with smooth slide animations.
*   **Internationalization (i18n)**: Fully translated into 13 languages (`en`, `de`, `fr`, `es`, `it`, `nl`, `pl`, `pt`, `tr`, `ja`, `ko`, `zh`, `uk`).
*   **Language**: Strict TypeScript with strict null checks and no `any` implicit types.
*   **Styling**: Vanilla CSS utilizing modern HSL color tokens, CSS Grid, Flexbox, and Container Queries.
*   **Performance**: Optimized responsive image pipeline, font preloads, and zero production runtime Node.js requirements.
*   **Privacy & Social**: Self-hosted Inter font variants, zero third-party CDNs, zero tracking scripts/cookies. Verified Mastodon `rel="me"` integration.

---

## 🎨 Design System & Visual Polish

The landing page features high-end custom UI elements that combine visual excellence with fast rendering speeds:

### 1. Morphing Ambient Background
The background consists of three floating glow blobs that dynamically rotate, translate, and morph over time using asymmetric `border-radius` variables (`will-change: transform, border-radius` enabled for GPU hardware acceleration).
*   **Blob 1**: Blue accent (`hsl(212, 100%, 60%)`), morphing over 20s.
*   **Blob 2**: Purple accent (`hsl(260, 80%, 60%)`), morphing over 24s.
*   **Blob 3**: Turquoise accent (`hsl(170, 85%, 50%)`), morphing over 28s.
*   **Dot Grid Mask**: A slowly shifting background dot-grid mask layered on top of the gradient.

### 2. Interaction Design
*   **MacOS App Mockups**: Featured projects are presented in simulated macOS window panels with interactive glassmorphism (`backdrop-filter`).
*   **Mouse-Reactive spotlights**: Panels and cards feature dynamic, mouse-tracking radial gradients on pointer hover (de-activated on mobile touch devices via media queries to preserve INP).
*   **Accessibility**: Keyboard-accessible Roving Tab Navigation, proper ARIA labels, and logical focus management.

---

## 📝 MDX Blog & RSS

A fully statically generated blog is integrated, supporting standard Markdown and MDX.
*   **Content Collections**: Posts are located in `src/content/blog/*.mdx`.
*   **Internationalization**: The blog inherits the site's robust i18n routing (`/[locale]/blog`), keeping the UI localized while preserving the original English article content.
*   **RSS Feed**: An auto-generated RSS feed is available at `/rss.xml`, syndicating all published articles.

---

## 📦 Project Taxonomy & Lifecycle

Projects are dynamically classified into exactly three categories, mapped in `src/data/projects.ts`:

| Category | Identifier | Description | Icon |
| :--- | :--- | :--- | :---: |
| **Desktop-Anwendungen** | `desktop` | Native applications for offline workflows and tools. | 🖥️ |
| **Webanwendungen** | `web` | Hosted web tools, blogs, and central dashboards. | 🌐 |
| **Extensions** | `extensions` | Browser add-ons fixing workflows where they occur. | 🧩 |

### Work-in-Progress (WIP) Rule

> [!WARNING]
> Projects marked with `status: 'wip'` represent active, unreleased software. To prevent users from installing unfinished software:
> 1. Download and live website links (`links.website`, `links.chrome`, and `links.firefox`) are automatically hidden from the UI (featured cards, grid cards, and tracker list).
> 2. Only the GitHub repository link (if available) is displayed to invite contributions.
> 3. Users can dynamically toggle these WIP projects directly in the UI.

### Client-Side Browser Prioritizing

For extension download buttons, the site automatically inspects the client browser at load time:
- **Firefox Clients**: Highlight and scale the Firefox Add-ons link, slide it to the front of the list, and make the Chrome Store button subtler.
- **Chrome/Chromium Clients**: Highlight and scale the Chrome Web Store link, slide it to the front of the list, and make the Firefox Add-ons button subtler.

---

## 🛠️ Local Development & Operations

### Requirements
- **Node.js** 18+
- **npm** 9+

### Commands

```bash
# Install dependencies
npm install

# Start local dev server (default port 4321)
npm run dev

# Compile production bundles
npm run build

# Preview production builds locally
npm run preview
```

### Git & Push Operations

> [!IMPORTANT]
> The VPS environment hosts the site by pulling the compiled production output (`dist/` directory) from this repository.
> Therefore, you **MUST** run a production compile and stage changes before pushing to remote!

```bash
# 1. Compile production output:
npm run build

# 2. Stage, commit, and push:
git add -A
git commit -m "Your commit message"
git push
```

---

## 🔒 Security & Server Configuration

### Caddyfile Configuration

For the recommended production configuration (including strict CSP, Zstandard compression, and immutable caching), please see the provided **[Caddyfile.example](./Caddyfile.example)** in the root of this repository.

Copy and adapt it for your own domain!
