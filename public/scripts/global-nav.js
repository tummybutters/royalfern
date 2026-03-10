const siteData = {
  "brand": {
    "name": "ROYAL FERN BARBER STUDIO",
    "homeNavClass": "is-home",
    "sharedTagline": "Professional haircuts, fades, beard trims, lineups, and classic grooming in National City, CA.",
    "locationNote": "3030 Plaza Bonita Road Unit #1336, National City, CA 91950. Studio #116."
  },
  "contact": {
    "bookingUrl": "https://getsquire.com/booking/book/royalfern-barber-studio-national-city",
    "bookingLabel": "Book Now",
    "bookingFooterLabel": "Book Online",
    "email": "royalfern992@gmail.com",
    "hoursText": "Open daily: 10:00 AM - 7:00 PM"
  },
  "social": {
    "instagram": {
      "href": "https://www.instagram.com/royalfernbarberstudio_sd/",
      "label": "Royal Fern Instagram"
    },
    "email": {
      "href": "mailto:royalfern992@gmail.com",
      "label": "Email Royal Fern"
    },
    "booking": {
      "href": "https://getsquire.com/booking/book/royalfern-barber-studio-national-city",
      "label": "Book Royal Fern"
    }
  },
  "nav": {
    "links": [
      {
        "key": "home",
        "href": "/",
        "label": "Home"
      },
      {
        "key": "gallery",
        "href": "/gallery/",
        "label": "Gallery"
      },
      {
        "key": "about",
        "href": "/about/",
        "label": "About"
      }
    ]
  },
  "footers": {
    "home": {
      "columns": [
        {
          "title": "Service Pages",
          "links": [
            {
              "href": "/services/",
              "label": "All Services"
            },
            {
              "href": "/fade-haircuts/",
              "label": "Fade Haircuts"
            },
            {
              "href": "/beard-trims-beard-lineups-shaping/",
              "label": "Beard Trims & Lineups"
            },
            {
              "href": "/gallery/",
              "label": "Haircut Gallery"
            }
          ]
        },
        {
          "title": "Company",
          "links": [
            {
              "href": "/about/",
              "label": "About Us"
            },
            {
              "href": "/gallery/",
              "label": "Gallery"
            },
            {
              "href": "/services/",
              "label": "Services"
            },
            {
              "href": "/contact-hours-walk-ins/",
              "label": "Hours & Booking"
            }
          ]
        },
        {
          "title": "Contact",
          "links": [
            {
              "href": "https://getsquire.com/booking/book/royalfern-barber-studio-national-city",
              "label": "Book Online",
              "external": true
            },
            {
              "href": "mailto:royalfern992@gmail.com",
              "label": "royalfern992@gmail.com"
            },
            {
              "text": "Open daily: 10:00 AM - 7:00 PM"
            },
            {
              "href": "/contact-hours-walk-ins/",
              "label": "Visit Details"
            }
          ]
        }
      ]
    },
    "shared": {
      "columns": [
        {
          "title": "Explore",
          "links": [
            {
              "href": "/",
              "label": "Home"
            },
            {
              "href": "/gallery/",
              "label": "Gallery"
            },
            {
              "href": "/about/",
              "label": "About"
            },
            {
              "href": "/services/",
              "label": "Services"
            }
          ]
        },
        {
          "title": "Service Pages",
          "links": [
            {
              "href": "/fade-haircuts/",
              "label": "Fade Haircuts"
            },
            {
              "href": "/beard-trims-beard-lineups-shaping/",
              "label": "Beard Trims & Lineups"
            },
            {
              "href": "/lineup-shape-up-haircuts-national-city/",
              "label": "Lineups & Shape Ups"
            },
            {
              "href": "/hot-towel-shave-straight-razor-national-city/",
              "label": "Hot Towel Shaves"
            }
          ]
        },
        {
          "title": "Contact",
          "links": [
            {
              "href": "https://getsquire.com/booking/book/royalfern-barber-studio-national-city",
              "label": "Book Online",
              "external": true
            },
            {
              "href": "mailto:royalfern992@gmail.com",
              "label": "royalfern992@gmail.com"
            },
            {
              "text": "Open daily: 10:00 AM - 7:00 PM"
            },
            {
              "href": "/contact-hours-walk-ins/",
              "label": "Hours, Walk-Ins & Booking"
            }
          ]
        }
      ]
    }
  }
};

(function initGlobalNav() {
  const path = window.location.pathname || "/";
  const normalizedPath = path === "/index.html" ? "/" : path.replace(/\/index\.html$/, "/");
  const isHome = normalizedPath === "/";
  const { brand, contact, social, nav: navData, footers } = siteData;

  const navClassNames = ["rf-site-nav"];
  if (isHome && brand.homeNavClass) {
    navClassNames.push(brand.homeNavClass);
  }

  const currentKey =
    normalizedPath === "/"
      ? "home"
      : normalizedPath.startsWith("/gallery/")
        ? "gallery"
        : normalizedPath.startsWith("/about/")
          ? "about"
          : "";

  const renderNavLinks = (className) =>
    navData.links
      .map(({ key, href, label }) => `<a href="${href}" data-nav-key="${key}"${className ? ` class="${className}"` : ""}>${label}</a>`)
      .join("");

  const renderListItems = (items) =>
    items
      .map((item) => {
        if (item.text) {
          return `<li>${item.text}</li>`;
        }

        const attrs = item.external ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<li><a href="${item.href}"${attrs}>${item.label}</a></li>`;
      })
      .join("");

  const renderFooterColumns = (columns) =>
    columns
      .map(
        (column) => `
        <div class="rf-footer-column">
          <h4>${column.title}</h4>
          <ul>
            ${renderListItems(column.links)}
          </ul>
        </div>
      `,
      )
      .join("");

  const socialIcons = {
    instagram:
      '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>',
    email:
      '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M4 6h16v12H4z"></path><path d="m4 7 8 6 8-6"></path></svg>',
    booking:
      '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M3 10h18"></path></svg>',
  };

  const nav = document.createElement("nav");
  nav.className = navClassNames.join(" ");
  nav.setAttribute("aria-label", "Primary");
  nav.innerHTML = `
    <a href="/" class="rf-nav-logo">
      <div class="rf-nav-logo-icon">
        <img src="/media/hero/royal-fern-logo.jpg" alt="${brand.name} logo">
      </div>
      <span class="rf-nav-logo-text">${brand.name}</span>
    </a>
    <div class="rf-nav-links">
      ${renderNavLinks("")}
      <a href="${contact.bookingUrl}" class="rf-nav-cta" target="_blank" rel="noopener noreferrer">${contact.bookingLabel}</a>
    </div>
    <button class="rf-nav-toggle" type="button" aria-label="Toggle menu" aria-expanded="false">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <div class="rf-mobile-panel" aria-hidden="true">
      <div class="rf-mobile-links">
        ${renderNavLinks("")}
        <a href="${contact.bookingUrl}" class="rf-mobile-cta" target="_blank" rel="noopener noreferrer">${contact.bookingLabel}</a>
      </div>
    </div>
  `;

  nav.querySelectorAll(`[data-nav-key="${currentKey}"]`).forEach((link) => {
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
            <img src="/media/hero/royal-fern-logo.jpg" alt="${brand.name} logo">
          </div>
          <div class="rf-footer-brand-name is-home-name">${brand.name}</div>
          <p>${brand.sharedTagline}</p>
          <div class="rf-footer-social" aria-label="${brand.name} links">
            <a href="${social.instagram.href}" aria-label="${social.instagram.label}" target="_blank" rel="noopener noreferrer">
              ${socialIcons.instagram}
            </a>
            <a href="${social.email.href}" aria-label="${social.email.label}">
              ${socialIcons.email}
            </a>
            <a href="${social.booking.href}" aria-label="${social.booking.label}" target="_blank" rel="noopener noreferrer">
              ${socialIcons.booking}
            </a>
          </div>
        </div>
        ${renderFooterColumns(footers.home.columns)}
      </div>
      <div class="rf-footer-bottom">
        <p>&copy; ${footerYear} ${brand.name}. All rights reserved.</p>
        <p>Crafted with precision in National City, CA</p>
      </div>
    `;
  } else {
    footer.innerHTML = `
      <div class="rf-footer-content">
        <div class="rf-footer-brand">
          <div class="rf-footer-brand-top">
            <div class="rf-footer-brand-logo">
              <img src="/media/hero/royal-fern-logo.jpg" alt="${brand.name} logo">
            </div>
            <div class="rf-footer-brand-name">${brand.name}</div>
          </div>
          <p>${brand.sharedTagline}</p>
          <p class="rf-footer-note">${brand.locationNote}</p>
        </div>
        ${renderFooterColumns(footers.shared.columns)}
      </div>
      <div class="rf-footer-bottom">
        <p>&copy; ${footerYear} ${brand.name}. All rights reserved.</p>
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
