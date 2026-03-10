const GOOGLE_FONTS_LINK = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Cinzel:wght@400;600&display=swap";

export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderAttrs(attrs = {}) {
  return Object.entries(attrs)
    .filter(([, value]) => value !== undefined && value !== null && value !== false)
    .map(([key, value]) => value === true ? key : `${key}="${escapeHtml(value)}"`)
    .join(" ");
}

export function renderLink(link, className) {
  const attrs = {
    class: className,
    href: link.href,
  };

  if (link.external) {
    attrs.target = "_blank";
    attrs.rel = "noopener noreferrer";
  }

  return `<a ${renderAttrs(attrs)}>${escapeHtml(link.label)}</a>`;
}

export function renderHead({
  title,
  description,
  includeServiceStyles = false,
  faqSchema = [],
  extraHeadMarkup = "",
}) {
  const faqScript = faqSchema.length > 0
    ? `  <script type="application/ld+json">\n${serializeJsonLd({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqSchema.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      })}\n  </script>\n`
    : "";

  const serviceStylesheet = includeServiceStyles
    ? '  <link rel="stylesheet" href="/styles/service-pages.css">\n'
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#144E47" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
${faqScript}  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${GOOGLE_FONTS_LINK}" rel="stylesheet">
  <link rel="stylesheet" href="/styles/global-nav.css">
${serviceStylesheet}${extraHeadMarkup ? `${extraHeadMarkup}\n` : ""}  <script type="module" src="/analytics.js"></script>
  <script src="/scripts/global-nav.js" defer></script>
</head>`;
}

function serializeJsonLd(data) {
  return JSON.stringify(data, null, 2).replaceAll("<", "\\u003c");
}
