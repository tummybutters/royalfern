import { escapeHtml, renderHead, renderLink } from "./service-page.shared.mjs";

const OVERVIEW_INLINE_STYLES = `  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --primary: #144E47;
      --gold: #D2B26A;
      --cream: #F5F0E8;
      --white: #FFFFFF;
      --dark: #0A2E2A;
    }
    html { scroll-behavior: smooth; overflow-x: clip; }
    body {
      font-family: 'Inter', sans-serif;
      background: var(--cream);
      color: var(--primary);
      min-height: 100vh;
    }
    .page-shell {
      min-height: 100vh;
      padding: 28px 28px 60px;
      position: relative;
      overflow: hidden;
      background:
        repeating-linear-gradient(45deg, rgba(20,78,71,0.035) 0 1px, transparent 1px 20px),
        var(--cream);
    }
    .hero-frame {
      max-width: 1240px;
      margin: 0 auto;
      border: 1px solid rgba(210,178,106,0.35);
      padding: 38px;
      position: relative;
      background: rgba(245,240,232,0.9);
      box-shadow: 0 24px 50px rgba(20,78,71,0.05);
    }
    .frame-corner {
      position: absolute;
      width: 38px;
      height: 38px;
      border: 2px solid rgba(210,178,106,0.75);
      pointer-events: none;
    }
    .frame-corner.tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
    .frame-corner.tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
    .frame-corner.bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
    .frame-corner.br { bottom: -1px; right: -1px; border-left: none; border-top: none; }
    .hero-inner {
      display: grid;
      grid-template-columns: minmax(260px, 0.92fr) 1.08fr;
      gap: 44px;
      align-items: center;
      min-height: 560px;
    }
    .hero-panel {
      position: relative;
      height: 100%;
      min-height: 520px;
      background:
        linear-gradient(to top, rgba(10,46,42,0.72), rgba(10,46,42,0.16)),
        radial-gradient(circle at 22% 18%, rgba(210,178,106,0.16), transparent 42%),
        #12322e;
      border: 1px solid rgba(20,78,71,0.18);
      overflow: hidden;
      display: grid;
      align-content: space-between;
      padding: 18px;
      box-shadow: 0 28px 55px rgba(20,78,71,0.12);
    }
    .hero-panel::before {
      content: '';
      position: absolute;
      inset: 14px;
      border: 1px solid rgba(210,178,106,0.28);
      pointer-events: none;
    }
    .hero-panel-badge {
      position: relative;
      z-index: 1;
      width: 74px;
      height: 74px;
      border: 1px solid rgba(210,178,106,0.35);
      background: rgba(10,46,42,0.45);
      backdrop-filter: blur(6px);
      padding: 8px;
      display: grid;
      place-items: center;
    }
    .hero-panel-badge img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .hero-panel-card {
      position: relative;
      z-index: 1;
      align-self: end;
      background: rgba(10,46,42,0.82);
      border: 1px solid rgba(210,178,106,0.18);
      padding: 14px 16px;
      max-width: 290px;
    }
    .hero-panel-card span {
      display: block;
      font-size: 10px;
      letter-spacing: 2px;
      color: var(--gold);
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .hero-panel-card strong {
      display: block;
      color: var(--white);
      font-family: 'Cinzel', serif;
      font-size: 24px;
      line-height: 1.25;
    }
    .hero-content {
      padding: 12px 0;
    }
    .hero-eyebrow {
      font-size: 12px;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 18px;
    }
    .hero-title {
      font-family: 'Cinzel', serif;
      color: var(--primary);
      font-size: clamp(38px, 4.6vw, 62px);
      line-height: 1.18;
      margin-bottom: 20px;
      max-width: 14ch;
    }
    .divider {
      display: flex;
      align-items: center;
      gap: 14px;
      margin: 22px 0 26px;
    }
    .divider-line {
      width: 78px;
      height: 1px;
      background: rgba(20,78,71,0.22);
    }
    .divider-icon {
      width: 10px;
      height: 10px;
      background: var(--gold);
      transform: rotate(45deg);
    }
    .hero-subtitle {
      font-size: 16px;
      line-height: 1.95;
      color: rgba(20,78,71,0.78);
      max-width: 52ch;
      margin-bottom: 26px;
    }
    .hero-cta-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .hero-cta {
      display: inline-block;
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 2.4px;
      font-size: 11px;
      padding: 14px 18px;
      border: 2px solid var(--primary);
      background: var(--primary);
      color: var(--white);
      font-family: 'Cinzel', serif;
    }
    .hero-cta.secondary {
      background: transparent;
      color: var(--primary);
      border-color: rgba(20,78,71,0.25);
      font-family: 'Inter', sans-serif;
      letter-spacing: 2px;
    }
    @media (max-width: 1024px) {
      .hero-inner {
        grid-template-columns: 1fr;
        gap: 24px;
        min-height: 0;
      }
      .hero-panel {
        min-height: 420px;
        order: 2;
      }
      .hero-content {
        order: 1;
      }
      .hero-title {
        max-width: none;
      }
    }
    @media (max-width: 768px) {
      .page-shell { padding: 16px 16px 40px; }
      .hero-frame { padding: 22px; }
      .hero-panel { min-height: 360px; }
      .hero-panel-card strong { font-size: 20px; }
      .divider-line { width: 52px; }
      .hero-subtitle { font-size: 15px; line-height: 1.85; }
      .hero-cta-row { width: 100%; }
      .hero-cta { width: 100%; text-align: center; }
    }
  </style>`;

export function renderServicesOverviewPage(page) {
  return `${renderHead({
    title: page.title,
    description: page.description,
    extraHeadMarkup: OVERVIEW_INLINE_STYLES,
  })}
<body>
  <main class="page-shell">
    <section class="hero-frame" aria-labelledby="page-title">
      <div class="frame-corner tl"></div>
      <div class="frame-corner tr"></div>
      <div class="frame-corner bl"></div>
      <div class="frame-corner br"></div>

      <div class="hero-inner">
        <div class="hero-panel" aria-hidden="true">
          <div class="hero-panel-badge">
            <img src="${escapeHtml(page.hero.panel.badgeImage)}" alt="" />
          </div>
          <div class="hero-panel-card">
            <span>${escapeHtml(page.hero.panel.kicker)}</span>
            <strong>${escapeHtml(page.hero.panel.headline)}</strong>
          </div>
        </div>

        <div class="hero-content">
          <div class="hero-eyebrow">${escapeHtml(page.hero.eyebrow)}</div>
          <h1 id="page-title" class="hero-title">${escapeHtml(page.hero.title)}</h1>
          <div class="divider" aria-hidden="true">
            <div class="divider-line"></div>
            <div class="divider-icon"></div>
            <div class="divider-line"></div>
          </div>
          <h2 class="hero-subtitle">${escapeHtml(page.hero.subtitle)}</h2>
          <div class="hero-cta-row">
            ${renderLink(page.hero.primaryCta, "hero-cta")}
            ${renderLink(page.hero.secondaryCta, "hero-cta secondary")}
          </div>
        </div>
      </div>
    </section>
  </main>
</body>
</html>
`;
}
