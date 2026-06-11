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

    // Browser client extension link optimization
    const detectBrowserAndOptimizeLinks = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isFirefox = userAgent.includes('firefox');
      const isChrome = userAgent.includes('chrome') || userAgent.includes('chromium');

      if (!isFirefox && !isChrome) return;

      const linkGroups = document.querySelectorAll(
        '.featured-project__links, .project-card__links, .tracker-links-group'
      );

      linkGroups.forEach((group) => {
        const chromeLink = group.querySelector('[data-link-platform="chrome"]') as HTMLElement | null;
        const firefoxLink = group.querySelector('[data-link-platform="firefox"]') as HTMLElement | null;

        if (chromeLink && firefoxLink) {
          if (isFirefox) {
            firefoxLink.classList.add('link-highlighted');
            chromeLink.classList.add('link-subtle');
            // Put Firefox before Chrome
            chromeLink.parentNode?.insertBefore(firefoxLink, chromeLink);
          } else if (isChrome) {
            chromeLink.classList.add('link-highlighted');
            firefoxLink.classList.add('link-subtle');
            // Put Chrome before Firefox
            firefoxLink.parentNode?.insertBefore(chromeLink, firefoxLink);
          }
        }
      });
    };
    detectBrowserAndOptimizeLinks();

    // Interactive Background Canvas Particle Grid
    const initBgCanvas = () => {
      const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement | null;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      interface Particle {
        x: number;
        y: number;
        x0: number;
        y0: number;
        vx: number;
        vy: number;
      }

      let particles: Particle[] = [];
      const spacing = 32;
      const repulsionRadius = 120;
      const repulsionStrength = 1.0;
      const spring = 0.08;
      const friction = 0.85;
      const dotRadius = 1.2;

      let mouse = { x: -1000, y: -1000, active: false };

      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      let isReducedMotion = motionQuery.matches;

      // Listen for reduced motion preference changes
      motionQuery.addEventListener('change', (e) => {
        isReducedMotion = e.matches;
        if (isReducedMotion) {
          cancelAnimation();
          drawStatic();
        } else {
          startAnimation();
        }
      });

      let dotColor = 'rgba(255, 255, 255, 0.09)';
      const updateColor = () => {
        const isLight = document.documentElement.dataset.theme === 'light';
        dotColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.09)';
      };

      const initGrid = () => {
        particles = [];
        const w = canvas.width;
        const h = canvas.height;
        const cols = Math.ceil(w / spacing) + 1;
        const rows = Math.ceil(h / spacing) + 1;

        for (let col = 0; col < cols; col++) {
          for (let row = 0; row < rows; row++) {
            const x = col * spacing;
            const y = row * spacing;
            particles.push({
              x,
              y,
              x0: x,
              y0: y,
              vx: 0,
              vy: 0
            });
          }
        }
      };

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initGrid();
        if (isReducedMotion) {
          drawStatic();
        }
      };

      window.addEventListener('resize', resize);
      resize();

      // Mouse tracking
      window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
      });

      window.addEventListener('mouseleave', () => {
        mouse.active = false;
        mouse.x = -1000;
        mouse.y = -1000;
      });

      // Touch tracking for mobile support
      window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          mouse.x = e.touches[0].clientX;
          mouse.y = e.touches[0].clientY;
          mouse.active = true;
        }
      }, { passive: true });

      window.addEventListener('touchend', () => {
        mouse.active = false;
        mouse.x = -1000;
        mouse.y = -1000;
      });

      let animationFrameId: number | null = null;

      const drawStatic = () => {
        updateColor();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = dotColor;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          ctx.beginPath();
          ctx.arc(p.x0, p.y0, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      const animate = () => {
        updateColor();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = dotColor;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.hypot(dx, dy);

            if (dist < repulsionRadius) {
              const force = (repulsionRadius - dist) / repulsionRadius;
              const angle = Math.atan2(dy, dx);
              // Accelerate away
              p.vx += Math.cos(angle) * force * repulsionStrength;
              p.vy += Math.sin(angle) * force * repulsionStrength;
            }
          }

          // Spring force back to home state
          const ax = (p.x0 - p.x) * spring;
          const ay = (p.y0 - p.y) * spring;

          p.vx += ax;
          p.vy += ay;

          // Friction damping
          p.vx *= friction;
          p.vy *= friction;

          // Update position
          p.x += p.vx;
          p.y += p.vy;

          // Optimization: snap to home if motion is tiny to prevent floats accumulation
          if (
            Math.abs(p.x - p.x0) < 0.01 &&
            Math.abs(p.y - p.y0) < 0.01 &&
            Math.abs(p.vx) < 0.01 &&
            Math.abs(p.vy) < 0.01
          ) {
            p.x = p.x0;
            p.y = p.y0;
            p.vx = 0;
            p.vy = 0;
          }

          // Render particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        animationFrameId = requestAnimationFrame(animate);
      };

      const startAnimation = () => {
        if (!animationFrameId && !isReducedMotion) {
          animate();
        }
      };

      const cancelAnimation = () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      };

      // Watch dataset.theme on <html> to dynamically update colors when toggling themes in static mode
      const themeObserver = new MutationObserver(() => {
        if (isReducedMotion) {
          drawStatic();
        }
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });

      if (!isReducedMotion) {
        startAnimation();
      } else {
        drawStatic();
      }
    };
    initBgCanvas();
  });
})();
