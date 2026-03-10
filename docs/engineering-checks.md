# Engineering Checks

`npm run check` is the one-command verification flow for this site.

It runs:

- `npm run check:source`
- `npm run build`
- `npm run check:dist`

## What Gets Enforced

### Source rules

- Every source HTML file must have a `<title>`.
- Missing meta descriptions are reported as warnings so the repo can adopt the check flow without blocking unrelated work.
- Placeholder `href="#"` links are disallowed.
- `cache: 'no-store'` is disallowed in page code for static payloads.
- Pages that load `global-nav.js` must not also ship page-local nav markup or page-local nav controller code.
- Service pages must use `/styles/service-pages.css`, include the `service-page` body class, and avoid inline `<style>` blocks.
- External scripts placed in `<head>` must be `async` or `defer`.

### Dist rules

- Built HTML/assets are checked for broken local links and asset references.
- File-size budgets are enforced for key pages and shared styles.
- Hero video bundle size is capped so the homepage does not silently drift back toward eager-heavy media.

## Current Budgets

- `dist/index.html` <= 105 KB
- `dist/about/index.html` <= 16 KB
- `dist/gallery/index.html` <= 22 KB
- `dist/services/index.html` <= 10 KB
- `dist/styles/global-nav.css` <= 10 KB
- `dist/styles/service-pages.css` <= 12 KB
- `public/data/google-reviews.json` <= 50 KB
- `public/media/hero/*.mp4` total <= 4.2 MB
- Any single hero video <= 1.2 MB
- `public/media/gallery/gallery-hero-wide.jpg` <= 520 KB

## How To Use This In Future Agent Work

- Before closing a task, run `npm run check`.
- If a page needs a structural exception, adjust the check script intentionally rather than bypassing it ad hoc.
- If a budget changes, document why in the commit/PR so the next agent understands the tradeoff.
