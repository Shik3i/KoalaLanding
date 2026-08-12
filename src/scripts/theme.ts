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

  // AbortController to clean up listeners from previous astro:page-load
  let pageLoadController: AbortController | null = null;
  let bgCanvasController: { canvas: HTMLCanvasElement; destroy: () => void } | null = null;

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
      const lightLabel = btn.dataset.labelLight ?? 'Switch to light theme';
      const darkLabel = btn.dataset.labelDark ?? 'Switch to dark theme';
      btn.setAttribute('aria-label',
        theme === DARK ? lightLabel : darkLabel
      );
      btn.setAttribute('aria-pressed', theme === LIGHT ? 'true' : 'false');
    }
    const themeColor = document.getElementById('theme-color');
    if (themeColor) {
      themeColor.setAttribute('content', theme === LIGHT ? '#ffffff' : '#0d0d0d');
    }
  }

  function toggleTheme(): void {
    const current = document.documentElement.dataset.theme ?? DARK;
    const next = current === DARK ? LIGHT : DARK;
    applyTheme(next);
    setStoredTheme(next);
  }

  // Init on astro:page-load (runs on initial load and after view transitions)
  document.addEventListener('astro:page-load', () => {
    // ---- Clean up listeners from previous navigation ----
    if (pageLoadController) pageLoadController.abort();
    pageLoadController = new AbortController();
    const signal = pageLoadController.signal;

    const stored = getStoredTheme();
    const theme = stored ?? DARK;
    applyTheme(theme);

    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggleTheme, { signal });
    }

    // Language switcher dropdown
    const langBtn = document.getElementById('lang-switcher-btn');
    const langDropdown = document.getElementById('lang-switcher-dropdown');
    if (langBtn && langDropdown) {
      const langLinks = Array.from(langDropdown.querySelectorAll('a'));
      const closeLanguageMenu = (restoreFocus = false) => {
        if (!langDropdown.classList.contains('is-open')) return;
        langDropdown.classList.remove('is-open');
        langBtn.setAttribute('aria-expanded', 'false');
        if (restoreFocus) langBtn.focus();
      };
      const openLanguageMenu = (focusTarget?: 'first' | 'last' | 'current') => {
        langDropdown.classList.add('is-open');
        langBtn.setAttribute('aria-expanded', 'true');
        if (!focusTarget || langLinks.length === 0) return;
        const target = focusTarget === 'last'
          ? langLinks.at(-1)
          : focusTarget === 'current'
            ? langLinks.find((link) => link.getAttribute('aria-current') === 'page') ?? langLinks[0]
            : langLinks[0];
        target?.focus();
      };
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (langDropdown.classList.contains('is-open')) {
          closeLanguageMenu();
        } else {
          openLanguageMenu();
        }
      }, { signal });
      langBtn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLanguageMenu('current');
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          openLanguageMenu('last');
        } else if (e.key === 'Escape') {
          closeLanguageMenu(true);
        }
      }, { signal });
      document.addEventListener('click', () => {
        closeLanguageMenu();
      }, { signal });
      langDropdown.addEventListener('click', (e) => e.stopPropagation(), { signal });
      langDropdown.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeLanguageMenu(true);
          return;
        }
        const currentIndex = langLinks.indexOf(document.activeElement as HTMLAnchorElement);
        if (currentIndex < 0) return;
        let nextIndex = currentIndex;
        if (e.key === 'ArrowDown') nextIndex = (currentIndex + 1) % langLinks.length;
        else if (e.key === 'ArrowUp') nextIndex = (currentIndex - 1 + langLinks.length) % langLinks.length;
        else if (e.key === 'Home') nextIndex = 0;
        else if (e.key === 'End') nextIndex = langLinks.length - 1;
        else return;
        e.preventDefault();
        langLinks[nextIndex]?.focus();
      }, { signal });
    }

    // Mobile nav
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileBtn && mobileNav) {
      const updateMobileMenuLabel = (isOpen: boolean) => {
        const label = isOpen
          ? mobileBtn.dataset.labelClose
          : mobileBtn.dataset.labelOpen;
        if (label) {
          mobileBtn.setAttribute('aria-label', label);
          mobileBtn.setAttribute('title', label);
        }
      };
      mobileBtn.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('is-open');
        mobileBtn.setAttribute('aria-expanded', String(isOpen));
        updateMobileMenuLabel(isOpen);
      }, { signal });
      mobileNav.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          mobileNav.classList.remove('is-open');
          mobileBtn.setAttribute('aria-expanded', 'false');
          updateMobileMenuLabel(false);
          mobileBtn.focus();
        }
      }, { signal });
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
          card.addEventListener('mousemove', (e) => trackGlow(e as MouseEvent, card as HTMLElement), { signal });
        });
      };
      attachGlowListeners();
    }

    // Interactive Project Category Filter tabs
    const filterContainer = document.querySelector('.project-filter');
    const gridItems = document.querySelectorAll('.project-grid-item, .tracker-row, .project-card-v2');
    const activeDesc = document.querySelector('.category-header__desc');

    if (filterContainer) {
      const buttons = Array.from(filterContainer.querySelectorAll('.filter-btn')) as HTMLButtonElement[];
      
      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const doFilter = () => {
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
                // Clear any manual inline styles left over
                htmlItem.style.opacity = '';
                htmlItem.style.transform = '';
                htmlItem.style.transition = '';
              } else {
                (item as HTMLElement).style.display = 'none';
              }
            });
          };

          if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const main = document.getElementById('main-content');
            if (main) main.style.viewTransitionName = 'none';
            
            const transition = document.startViewTransition(() => doFilter());
            
            transition.finished.finally(() => {
              if (main) main.style.viewTransitionName = '';
            });
          } else {
            doFilter();
          }
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

    // Interactive Background Canvas Floating Constellation Mesh
    const initBgCanvas = () => {
      const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement | null;
      if (!canvas) return null;

      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      const canvasController = new AbortController();
      const canvasSignal = canvasController.signal;

      interface Particle {
        x: number;
        y: number;
        x0: number; // grid home x
        y0: number; // grid home y
        vx: number;
        vy: number;
        angle: number;
        speed: number;
        orbitRadius: number;
        radius: number;
      }

      let particles: Particle[] = [];
      let viewportWidth = window.innerWidth;
      let viewportHeight = window.innerHeight;
      const spacing = 50; // Spacious 50px grid
      const magnetRadius = 180;
      const spring = 0.05;
      const friction = 0.82;
      const maxConnectDist = 75; // max line draw distance between particles

      let mouse = { x: -1000, y: -1000, active: false };

      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      let isReducedMotion = motionQuery.matches;

      motionQuery.addEventListener('change', (e) => {
        isReducedMotion = e.matches;
        if (isReducedMotion) {
          cancelAnimation();
          drawStatic();
        } else {
          startAnimation();
        }
      }, { signal: canvasSignal });

      // Colors matching user preference dataset.theme
      let isLight = document.documentElement.dataset.theme === 'light';
      let dotColor = '';
      let tetherColor = '';
      let activeDotColor = '';

      const updateColors = () => {
        isLight = document.documentElement.dataset.theme === 'light';
        if (isLight) {
          dotColor = 'rgba(40, 124, 66, 0.15)';
          tetherColor = 'rgba(40, 124, 66, '; // to append opacity
          activeDotColor = 'rgba(40, 124, 66, 0.8)';
        } else {
          dotColor = 'rgba(86, 174, 108, 0.2)';
          tetherColor = 'rgba(86, 174, 108, '; // to append opacity
          activeDotColor = 'rgba(108, 197, 129, 0.85)';
        }
      };

      const initGrid = () => {
        particles = [];
        const w = viewportWidth;
        const h = viewportHeight;
        const cols = Math.ceil(w / spacing) + 1;
        const rows = Math.ceil(h / spacing) + 1;

        for (let col = 0; col < cols; col++) {
          for (let row = 0; row < rows; row++) {
            const x = col * spacing;
            const y = row * spacing;
            
            // Randomize size and drift variables
            const radius = 1.0 + Math.random() * 1.0; // base size 1.0 - 2.0px
            const speed = 0.005 + Math.random() * 0.01; // rads per frame
            const orbitRadius = 6 + Math.random() * 12; // drift range 6px to 18px
            const angle = Math.random() * Math.PI * 2;

            particles.push({
              x,
              y,
              x0: x,
              y0: y,
              vx: 0,
              vy: 0,
              angle,
              speed,
              orbitRadius,
              radius
            });
          }
        }
      };

      const resize = () => {
        viewportWidth = window.innerWidth;
        viewportHeight = window.innerHeight;
        const pixelRatio = Math.max(1, window.devicePixelRatio || 1);
        canvas.width = Math.round(viewportWidth * pixelRatio);
        canvas.height = Math.round(viewportHeight * pixelRatio);
        canvas.style.width = `${viewportWidth}px`;
        canvas.style.height = `${viewportHeight}px`;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        initGrid();
        if (isReducedMotion) {
          drawStatic();
        }
      };

      let resizeTimeout: number | undefined;
      const debouncedResize = () => {
        if (resizeTimeout !== undefined) window.clearTimeout(resizeTimeout);
        resizeTimeout = window.setTimeout(resize, 150);
      };

      window.addEventListener('resize', debouncedResize, { signal: canvasSignal });
      resize();

      // Mouse tracking
      const setMousePos = (clientX: number, clientY: number) => {
        mouse.x = clientX;
        mouse.y = clientY;
        mouse.active = true;
      };

      window.addEventListener('mousemove', (e) => {
        setMousePos(e.clientX, e.clientY);
      }, { signal: canvasSignal });

      window.addEventListener('mouseleave', () => {
        mouse.active = false;
        mouse.x = -1000;
        mouse.y = -1000;
      }, { signal: canvasSignal });

      // Touch tracking for mobile support
      window.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
          setMousePos(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { signal: canvasSignal, passive: true });

      window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          setMousePos(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { signal: canvasSignal, passive: true });

      window.addEventListener('touchend', () => {
        mouse.active = false;
        mouse.x = -1000;
        mouse.y = -1000;
      }, { signal: canvasSignal });

      let animationFrameId: number | null = null;

      const drawStatic = () => {
        updateColors();
        ctx.clearRect(0, 0, viewportWidth, viewportHeight);
        
        ctx.fillStyle = dotColor;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          ctx.beginPath();
          ctx.arc(p.x0, p.y0, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      const animate = () => {
        updateColors();
        ctx.clearRect(0, 0, viewportWidth, viewportHeight);

        // 1. Draw Constellation lines between particles
        ctx.lineWidth = 0.8;
        const spatialGrid = new Map<string, number[]>();
        for (let i = 0; i < particles.length; i++) {
          const particle = particles[i];
          const cellX = Math.floor(particle.x / maxConnectDist);
          const cellY = Math.floor(particle.y / maxConnectDist);
          const key = `${cellX},${cellY}`;
          const cell = spatialGrid.get(key);
          if (cell) cell.push(i);
          else spatialGrid.set(key, [i]);
        }

        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          const cellX = Math.floor(p1.x / maxConnectDist);
          const cellY = Math.floor(p1.y / maxConnectDist);
          for (let offsetX = -1; offsetX <= 1; offsetX++) {
            for (let offsetY = -1; offsetY <= 1; offsetY++) {
              const neighbors = spatialGrid.get(`${cellX + offsetX},${cellY + offsetY}`);
              if (!neighbors) continue;
              for (const j of neighbors) {
                if (j <= i) continue;
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distSq = dx * dx + dy * dy;
                const maxSq = maxConnectDist * maxConnectDist;

                if (distSq < maxSq) {
                  const dist = Math.sqrt(distSq);
                  const opacity = (1 - dist / maxConnectDist) * 0.15;
                  ctx.strokeStyle = isLight
                    ? `rgba(40, 124, 66, ${opacity * 0.75})`
                    : `rgba(86, 174, 108, ${opacity * 1.1})`;
                  ctx.beginPath();
                  ctx.moveTo(p1.x, p1.y);
                  ctx.lineTo(p2.x, p2.y);
                  ctx.stroke();

                  // Mutual repulsion for dynamic feeling
                  if (distSq > 0 && distSq < 900) { // 30px radius
                    const force = (30 - dist) / 30 * 0.04;
                    const fx = (dx / dist) * force;
                    const fy = (dy / dist) * force;
                    p1.vx += fx;
                    p1.vy += fy;
                    p2.vx -= fx;
                    p2.vy -= fy;
                  }
                }
              }
            }
          }
        }

        // 2. Physics & Draw Particles
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Slow organic wave drift
          p.angle += p.speed;
          const targetX = p.x0 + Math.cos(p.angle) * p.orbitRadius;
          const targetY = p.y0 + Math.sin(p.angle * 0.75) * p.orbitRadius;

          let ax = (targetX - p.x) * spring;
          let ay = (targetY - p.y) * spring;

          let dist = 9999;
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            dist = Math.hypot(dx, dy);

            if (dist < magnetRadius) {
              const force = (magnetRadius - dist) / magnetRadius;
              const angle = Math.atan2(dy, dx);
              
              if (dist > 40) {
                ax -= Math.cos(angle) * force * 1.4;
                ay -= Math.sin(angle) * force * 1.4;
              } else {
                const repelForce = (40 - dist) / 40;
                ax += Math.cos(angle) * repelForce * 2.0;
                ay += Math.sin(angle) * repelForce * 2.0;
              }
            }
          }

          p.vx += ax;
          p.vy += ay;
          p.vx *= friction;
          p.vy *= friction;
          p.x += p.vx;
          p.y += p.vy;

          let currentRadius = p.radius;
          let currentFill = dotColor;

          if (dist < magnetRadius) {
            const factor = (magnetRadius - dist) / magnetRadius;
            currentRadius = p.radius + factor * 2.0;
            currentFill = activeDotColor;
          }

          ctx.fillStyle = currentFill;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // 3. Draw mouse-tether constellation lines
        if (mouse.active) {
          ctx.lineWidth = 1.0;
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            
            if (dist < 150) {
              const opacity = (1 - dist / 150) * 0.28;
              ctx.strokeStyle = `${tetherColor}${opacity})`;
              ctx.beginPath();
              ctx.moveTo(mouse.x, mouse.y);
              ctx.lineTo(p.x, p.y);
              ctx.stroke();
            }
          }
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

      return {
        canvas,
        destroy: () => {
          cancelAnimation();
          themeObserver.disconnect();
          canvasController.abort();
        }
      };
    };
    const currentCanvas = document.getElementById('bg-canvas') as HTMLCanvasElement | null;
    if (bgCanvasController && bgCanvasController.canvas !== currentCanvas) {
      bgCanvasController.destroy();
      bgCanvasController = null;
    }
    if (!bgCanvasController) {
      bgCanvasController = initBgCanvas();
    }
  });
})();
