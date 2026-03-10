import { escapeHtml, renderHead, renderLink } from "./service-page.shared.mjs";

export function renderServiceDetailPage(page) {
  return `${renderHead({
    title: page.title,
    description: page.description,
    includeServiceStyles: true,
    faqSchema: page.faqSchema,
  })}
<body class="${escapeHtml(page.bodyClass)}">
  <main class="page-shell">
    <section class="hero-frame" aria-labelledby="page-title">
      <div class="frame-corner tl"></div>
      <div class="frame-corner tr"></div>
      <div class="frame-corner bl"></div>
      <div class="frame-corner br"></div>

      <div class="hero-inner">
${renderHero(page.hero)}
      </div>
    </section>
${page.sections.map(renderSection).join("\n")}
  </main>
</body>
</html>
`;
}

function renderHero(hero) {
  if (hero.variant === "side") {
    return `        <div class="hero-content">
          <div class="hero-eyebrow">${escapeHtml(hero.eyebrow)}</div>
          <h1 id="page-title" class="hero-title">${escapeHtml(hero.title)}</h1>
          <div class="divider" aria-hidden="true">
            <div class="divider-line"></div>
            <div class="divider-icon"></div>
            <div class="divider-line"></div>
          </div>
          <h2 class="hero-subtitle">${escapeHtml(hero.subtitle)}</h2>
          <div class="hero-cta-row">
            ${renderLink(hero.primaryCta, "hero-cta")}
            ${renderLink(hero.secondaryCta, "hero-cta secondary")}
          </div>
        </div>

        <div class="hero-side">
${hero.sideArticles.map(renderHeroSideArticle).join("\n")}
        </div>`;
  }

  return `        <div class="hero-panel" aria-hidden="true">
          <div class="hero-panel-badge">
            <img src="${escapeHtml(hero.panel.badgeImage)}" alt="" />
          </div>
          <div class="hero-panel-card">
            <span>${escapeHtml(hero.panel.kicker)}</span>
            <strong>${escapeHtml(hero.panel.headline)}</strong>
          </div>
        </div>

        <div class="hero-content">
          <div class="hero-eyebrow">${escapeHtml(hero.eyebrow)}</div>
          <h1 id="page-title" class="hero-title">${escapeHtml(hero.title)}</h1>
          <div class="divider" aria-hidden="true">
            <div class="divider-line"></div>
            <div class="divider-icon"></div>
            <div class="divider-line"></div>
          </div>
          <h2 class="hero-subtitle">${escapeHtml(hero.subtitle)}</h2>
          <div class="hero-cta-row">
            ${renderLink(hero.primaryCta, "hero-cta")}
            ${renderLink(hero.secondaryCta, "hero-cta secondary")}
          </div>
        </div>`;
}

function renderHeroSideArticle(article) {
  if (article.type === "hours-card") {
    return `          <article class="hours-card">
${article.rows.map((row) => `            <div class="hours-row"><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(row.value)}</strong></div>`).join("\n")}
          </article>`;
  }

  const content = article.html ?? escapeHtml(article.text);
  return `          <article class="tile">
            <h3>${escapeHtml(article.title)}</h3>
            <p>${content}</p>
          </article>`;
}

function renderSection(section) {
  return `    <section class="content-frame" aria-labelledby="${escapeHtml(section.id)}">
      <div class="section-header">
        <span class="section-kicker">${escapeHtml(section.kicker)}</span>
        <h2 id="${escapeHtml(section.id)}" class="section-title">${escapeHtml(section.title)}</h2>
${section.text ? `        <p class="section-text">${escapeHtml(section.text)}</p>\n` : ""}      </div>
${renderSectionBody(section)}
    </section>`;
}

function renderSectionBody(section) {
  if (section.layout === "detail-grid") {
    return `      <div class="detail-grid">
${section.items.map((item) => `        <article class="detail-card">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </article>`).join("\n")}
      </div>`;
  }

  if (section.layout === "split-grid") {
    return `      <div class="split-grid">
${section.items.map((item) => `        <article class="split-block">
          <h3>${escapeHtml(item.title)}</h3>
${renderSplitBlockContent(item)}
        </article>`).join("\n")}
      </div>`;
  }

  return `      <div class="faq-grid">
${section.items.map((item) => `        <article class="faq-item">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </article>`).join("\n")}
      </div>`;
}

function renderSplitBlockContent(item) {
  if (Array.isArray(item.list)) {
    return `          <ul class="clean-list">
${item.list.map((entry) => `            <li>${escapeHtml(entry)}</li>`).join("\n")}
          </ul>`;
  }

  return `          <p>${escapeHtml(item.text)}</p>`;
}
