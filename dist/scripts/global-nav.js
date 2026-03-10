(function initGlobalNav() {
  const path = window.location.pathname || "/";
  const normalizedPath = path === "/index.html" ? "/" : path.replace(/\/index\.html$/, "/");
  const isHome = normalizedPath === "/";

  const nav = document.createElement("nav");
  nav.className = "rf-site-nav";
  if (isHome) {
    nav.classList.add("is-home");
  }
  nav.setAttribute("aria-label", "Primary");
  nav.innerHTML = `
    <a href="/" class="rf-nav-logo">
      <div class="rf-nav-logo-icon">
        <img src="/media/hero/royal-fern-logo.jpg" alt="Royal Fern Barber Studio logo">
      </div>
      <span class="rf-nav-logo-text">ROYAL FERN BARBER STUDIO</span>
    </a>
    <div class="rf-nav-links">
      <a href="/" data-nav-key="home">Home</a>
      <a href="/gallery/" data-nav-key="gallery">Gallery</a>
      <a href="/about/" data-nav-key="about">About</a>
      <a href="https://getsquire.com/booking/book/royalfern-barber-studio-national-city" class="rf-nav-cta" target="_blank" rel="noopener noreferrer">Book Now</a>
    </div>
    <button class="rf-nav-toggle" type="button" aria-label="Toggle menu" aria-expanded="false">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <div class="rf-mobile-panel" aria-hidden="true">
      <div class="rf-mobile-links">
        <a href="/" data-nav-key="home">Home</a>
        <a href="/gallery/" data-nav-key="gallery">Gallery</a>
        <a href="/about/" data-nav-key="about">About</a>
        <a href="https://getsquire.com/booking/book/royalfern-barber-studio-national-city" class="rf-mobile-cta" target="_blank" rel="noopener noreferrer">Book Now</a>
      </div>
    </div>
  `;

  const navKey = normalizedPath === "/" ? "home" : normalizedPath.startsWith("/gallery/") ? "gallery" : normalizedPath.startsWith("/about/") ? "about" : "";
  nav.querySelectorAll(`[data-nav-key="${navKey}"]`).forEach((link) => {
    link.setAttribute("aria-current", "page");
  });

  const existingNav = document.querySelector("nav");
  if (existingNav) {
    existingNav.replaceWith(nav);
  } else if (document.body.firstElementChild) {
    document.body.insertBefore(nav, document.body.firstElementChild);
  } else {
    document.body.appendChild(nav);
  }

  if (!isHome) {
    const spacer = document.createElement("div");
    spacer.className = "rf-nav-spacer";
    nav.insertAdjacentElement("afterend", spacer);
  }

  const toggle = nav.querySelector(".rf-nav-toggle");
  const mobilePanel = nav.querySelector(".rf-mobile-panel");

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    mobilePanel.setAttribute("aria-hidden", String(!open));
  };

  const syncScrolled = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 100);
  };

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(!nav.classList.contains("is-open"));
  });

  mobilePanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(event.target)) return;
    setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });

  window.addEventListener("scroll", syncScrolled, { passive: true });
  syncScrolled();

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const shouldPrefetch = !connection?.saveData && connection?.effectiveType !== "slow-2g" && connection?.effectiveType !== "2g";
  const prefetchedUrls = new Set();

  const prefetchPage = (href) => {
    if (!shouldPrefetch || !href || prefetchedUrls.has(href)) {
      return;
    }

    prefetchedUrls.add(href);

    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "document";
    link.href = href;
    document.head.appendChild(link);
  };

  nav.querySelectorAll("a[href]").forEach((link) => {
    const url = new URL(link.href, window.location.origin);

    if (url.origin !== window.location.origin || url.pathname === normalizedPath) {
      return;
    }

    const warmRoute = () => prefetchPage(url.href);
    link.addEventListener("pointerenter", warmRoute, { passive: true });
    link.addEventListener("focus", warmRoute);
    link.addEventListener("touchstart", warmRoute, { passive: true });
  });

  const footer = document.createElement("footer");
  const footerYear = new Date().getFullYear();
  footer.className = "rf-site-footer";
  if (isHome) {
    footer.classList.add("is-home");
    footer.innerHTML = `
      <div class="rf-footer-content">
        <div class="rf-footer-brand">
          <div class="rf-footer-brand-logo is-home-logo">
            <img src="/media/hero/royal-fern-logo.jpg" alt="Royal Fern Barber Studio logo">
          </div>
          <div class="rf-footer-brand-name is-home-name">ROYAL FERN BARBER STUDIO</div>
          <p>Professional haircuts, fades, beard trims, lineups, and classic grooming in National City, CA.</p>
          <div class="rf-footer-social" aria-label="Royal Fern links">
            <a href="https://www.instagram.com/royalfernbarberstudio_sd/" aria-label="Royal Fern Instagram" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="mailto:royalfern992@gmail.com" aria-label="Email Royal Fern">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M4 6h16v12H4z"></path><path d="m4 7 8 6 8-6"></path></svg>
            </a>
            <a href="https://getsquire.com/booking/book/royalfern-barber-studio-national-city" aria-label="Book Royal Fern" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M3 10h18"></path></svg>
            </a>
          </div>
        </div>
        <div class="rf-footer-column">
          <h4>Service Pages</h4>
          <ul>
            <li><a href="/services/">All Services</a></li>
            <li><a href="/fade-haircuts/">Fade Haircuts</a></li>
            <li><a href="/beard-trims-beard-lineups-shaping/">Beard Trims & Lineups</a></li>
            <li><a href="/gallery/">Haircut Gallery</a></li>
          </ul>
        </div>
        <div class="rf-footer-column">
          <h4>Company</h4>
          <ul>
            <li><a href="/about/">About Us</a></li>
            <li><a href="/gallery/">Gallery</a></li>
            <li><a href="/services/">Services</a></li>
            <li><a href="/contact-hours-walk-ins/">Hours & Booking</a></li>
          </ul>
        </div>
        <div class="rf-footer-column">
          <h4>Contact</h4>
          <ul>
            <li><a href="https://getsquire.com/booking/book/royalfern-barber-studio-national-city" target="_blank" rel="noopener noreferrer">Book Online</a></li>
            <li><a href="mailto:royalfern992@gmail.com">royalfern992@gmail.com</a></li>
            <li>Open daily: 10:00 AM - 7:00 PM</li>
            <li><a href="/contact-hours-walk-ins/">Visit Details</a></li>
          </ul>
        </div>
      </div>
      <div class="rf-footer-bottom">
        <p>&copy; ${footerYear} Royal Fern Barber Studio. All rights reserved.</p>
        <p>Crafted with precision in National City, CA</p>
      </div>
    `;
  } else {
    footer.innerHTML = `
      <div class="rf-footer-content">
        <div class="rf-footer-brand">
          <div class="rf-footer-brand-top">
            <div class="rf-footer-brand-logo">
              <img src="/media/hero/royal-fern-logo.jpg" alt="Royal Fern Barber Studio logo">
            </div>
            <div class="rf-footer-brand-name">ROYAL FERN BARBER STUDIO</div>
          </div>
          <p>Professional haircuts, fades, beard trims, lineups, and classic grooming in National City, CA.</p>
          <p class="rf-footer-note">3030 Plaza Bonita Road Unit #1336, National City, CA 91950. Studio #116.</p>
        </div>
        <div class="rf-footer-column">
          <h4>Explore</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/gallery/">Gallery</a></li>
            <li><a href="/about/">About</a></li>
            <li><a href="/services/">Services</a></li>
          </ul>
        </div>
        <div class="rf-footer-column">
          <h4>Service Pages</h4>
          <ul>
            <li><a href="/fade-haircuts/">Fade Haircuts</a></li>
            <li><a href="/beard-trims-beard-lineups-shaping/">Beard Trims & Lineups</a></li>
            <li><a href="/lineup-shape-up-haircuts-national-city/">Lineups & Shape Ups</a></li>
            <li><a href="/hot-towel-shave-straight-razor-national-city/">Hot Towel Shaves</a></li>
          </ul>
        </div>
        <div class="rf-footer-column">
          <h4>Contact</h4>
          <ul>
            <li><a href="https://getsquire.com/booking/book/royalfern-barber-studio-national-city" target="_blank" rel="noopener noreferrer">Book Online</a></li>
            <li><a href="mailto:royalfern992@gmail.com">royalfern992@gmail.com</a></li>
            <li>Open daily: 10:00 AM - 7:00 PM</li>
            <li><a href="/contact-hours-walk-ins/">Hours, Walk-Ins & Booking</a></li>
          </ul>
        </div>
      </div>
      <div class="rf-footer-bottom">
        <p>&copy; ${footerYear} Royal Fern Barber Studio. All rights reserved.</p>
        <p>Crafted with precision in National City, CA</p>
      </div>
    `;
  }

  const existingFooter = document.querySelector("footer");
  if (existingFooter) {
    existingFooter.replaceWith(footer);
  } else {
    const main = document.querySelector("main");
    if (main && main.parentNode) {
      main.insertAdjacentElement("afterend", footer);
    } else {
      document.body.appendChild(footer);
    }
  }

  footer.querySelectorAll("a[href]").forEach((link) => {
    const url = new URL(link.href, window.location.origin);

    if (url.origin !== window.location.origin || url.pathname === normalizedPath) {
      return;
    }

    const warmRoute = () => prefetchPage(url.href);
    link.addEventListener("pointerenter", warmRoute, { passive: true });
    link.addEventListener("focus", warmRoute);
    link.addEventListener("touchstart", warmRoute, { passive: true });
  });

  const warmCommonRoutes = () => {
    ["/", "/gallery/", "/about/", "/services/"].forEach((href) => {
      if (href !== normalizedPath) {
        prefetchPage(new URL(href, window.location.origin).href);
      }
    });
  };

  if (shouldPrefetch) {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(warmCommonRoutes, { timeout: 1200 });
    } else {
      window.setTimeout(warmCommonRoutes, 600);
    }
  }
})();
