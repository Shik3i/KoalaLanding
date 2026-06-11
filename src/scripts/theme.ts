/**
 * Theme toggle script.
 * This file is imported as a module in the <head> via <script src> (not inline),
 * so it is compatible with strict CSP (script-src 'self').
 *
 * The anti-flash snippet is a separate tiny inline script in BaseLayout.astro.
 * Its SHA-256 hash must be added to the Caddy CSP configuration.
 * See README for the exact hash value.
 */

(function () {
  const STORAGE_KEY = 'koala-theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  function getStoredTheme(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function setStoredTheme(theme: string): void {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage unavailable, ignore
    }
  }

  function applyTheme(theme: string): void {
    document.documentElement.dataset.theme = theme;
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label',
        theme === DARK ? 'Switch to light theme' : 'Switch to dark theme'
      );
      btn.setAttribute('aria-pressed', theme === LIGHT ? 'true' : 'false');
    }
  }

  function toggleTheme(): void {
    const current = document.documentElement.dataset.theme ?? DARK;
    const next = current === DARK ? LIGHT : DARK;
    applyTheme(next);
    setStoredTheme(next);
  }

  // Init on DOMContentLoaded (theme is already set by inline anti-flash snippet)
  document.addEventListener('DOMContentLoaded', () => {
    const stored = getStoredTheme();
    const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? LIGHT : DARK;
    const theme = stored ?? preferred;
    applyTheme(theme);

    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
    }

    // Language switcher dropdown
    const langBtn = document.getElementById('lang-switcher-btn');
    const langDropdown = document.getElementById('lang-switcher-dropdown');
    if (langBtn && langDropdown) {
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = langDropdown.classList.toggle('is-open');
        langBtn.setAttribute('aria-expanded', String(isOpen));
      });
      document.addEventListener('click', () => {
        langDropdown.classList.remove('is-open');
        langBtn.setAttribute('aria-expanded', 'false');
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          langDropdown.classList.remove('is-open');
          langBtn.setAttribute('aria-expanded', 'false');
          langBtn.focus();
        }
      });
    }

    // Mobile nav
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileBtn && mobileNav) {
      mobileBtn.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('is-open');
        mobileBtn.setAttribute('aria-expanded', String(isOpen));
      });
    }
  });
})();
