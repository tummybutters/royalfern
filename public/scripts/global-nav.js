(function initGlobalNav() {
  const path = window.location.pathname || "/";
  const normalizedPath = path === "/index.html" ? "/" : path.replace(/\/index\.html$/, "/");
  const isHome = normalizedPath === "/";

  const nav = document.createElement("nav");
  nav.className = "rf-site-nav";
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

  const footer = document.createElement("footer");
  const footerYear = new Date().getFullYear();
  footer.className = "rf-site-footer";
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
})();
