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

    // Dynamic Hover Coordinates for Radial Glow Effect (only for hover-capable pointer devices)
    if (window.matchMedia('(hover: hover)').matches) {
      let frameId: number | null = null;
      const trackGlow = (e: MouseEvent, card: HTMLElement) => {
        if (frameId) cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        });
      };

      const attachGlowListeners = () => {
        document.querySelectorAll('.project-card, .featured-project, .tracker-row').forEach((card) => {
          card.addEventListener('mousemove', (e) => trackGlow(e as MouseEvent, card as HTMLElement));
        });
      };
      attachGlowListeners();
    }

    // Interactive Project Category Filter tabs
    const filterContainer = document.querySelector('.project-filter');
    const gridItems = document.querySelectorAll('.project-grid-item, .tracker-row');
    const activeDesc = document.querySelector('.category-header__desc');

    if (filterContainer) {
      const buttons = Array.from(filterContainer.querySelectorAll('.filter-btn')) as HTMLButtonElement[];
      
      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          // Update accessibility active states
          buttons.forEach((b) => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
            b.setAttribute('tabindex', '-1');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
          btn.setAttribute('tabindex', '0');

          const category = btn.getAttribute('data-category') || 'all';

          // Update active category description if element exists
          const descText = btn.getAttribute('data-desc') || '';
          if (activeDesc) {
            activeDesc.textContent = descText;
          }

          gridItems.forEach((item) => {
            const itemCat = item.getAttribute('data-category');
            if (category === 'all' || itemCat === category) {
              const htmlItem = item as HTMLElement;
              htmlItem.style.display = '';
              htmlItem.style.opacity = '0';
              htmlItem.style.transform = 'scale(0.98)';
              // Trigger reflow for transition
              void htmlItem.offsetHeight;
              htmlItem.style.transition = 'opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)';
              htmlItem.style.opacity = '1';
              htmlItem.style.transform = 'scale(1)';
            } else {
              const htmlItem = item as HTMLElement;
              htmlItem.style.opacity = '0';
              htmlItem.style.transform = 'scale(0.98)';
              htmlItem.style.transition = 'opacity var(--dur-fast) var(--ease-in), transform var(--dur-fast) var(--ease-in)';
              
              // Hide after transition
              setTimeout(() => {
                if (!btn.classList.contains('active') || (category !== 'all' && itemCat !== category)) {
                  htmlItem.style.display = 'none';
                }
              }, 150);
            }
          });
        });
      });

      // Keyboard arrow navigation (Roving Tabindex) for accessibility tablist
      filterContainer.addEventListener('keydown', (e: Event) => {
        const keyEvent = e as KeyboardEvent;
        const activeIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
        if (activeIndex === -1) return;

        let nextIndex = activeIndex;
        if (keyEvent.key === 'ArrowRight' || keyEvent.key === 'ArrowDown') {
          keyEvent.preventDefault();
          nextIndex = (activeIndex + 1) % buttons.length;
        } else if (keyEvent.key === 'ArrowLeft' || keyEvent.key === 'ArrowUp') {
          keyEvent.preventDefault();
          nextIndex = (activeIndex - 1 + buttons.length) % buttons.length;
        } else if (keyEvent.key === 'Home') {
          keyEvent.preventDefault();
          nextIndex = 0;
        } else if (keyEvent.key === 'End') {
          keyEvent.preventDefault();
          nextIndex = buttons.length - 1;
        }

        if (nextIndex !== activeIndex) {
          buttons[nextIndex].focus();
          buttons[nextIndex].click(); // Select tab automatically on focus shift
        }
      });
    }
  });
})();
