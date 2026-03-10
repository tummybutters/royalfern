import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const rootDir = process.cwd();
const ignoredDirs = new Set([".git", "dist", "node_modules", "public", "tmp"]);
const servicePagePaths = new Set([
  "fade-haircuts/index.html",
  "beard-trims-beard-lineups-shaping/index.html",
  "mens-haircuts-national-city/index.html",
  "lineup-shape-up-haircuts-national-city/index.html",
  "hot-towel-shave-straight-razor-national-city/index.html",
  "contact-hours-walk-ins/index.html",
]);

function collectHtmlFiles(dir, results = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      if (!ignoredDirs.has(entry)) {
        collectHtmlFiles(fullPath, results);
      }
      continue;
    }

    if (stats.isFile() && entry.endsWith(".html")) {
      results.push(fullPath);
    }
  }

  return results;
}

function hasNonEmptyDescription(html) {
  const match = html.match(/<meta\s+name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  return Boolean(match?.[1]?.trim());
}

function validateScriptsInHead(html, filePath, errors) {
  const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
  if (!headMatch) return;

  const scriptMatches = [...headMatch[1].matchAll(/<script\b[^>]*\bsrc=["'][^"']+["'][^>]*>/gi)];
  for (const [tag] of scriptMatches) {
    if (!/\b(?:defer|async)\b/i.test(tag)) {
      errors.push(`${filePath}: external <script> tags in <head> must be async or defer`);
    }
  }
}

const htmlFiles = collectHtmlFiles(rootDir);
const errors = [];
const warnings = [];

for (const filePath of htmlFiles) {
  const relativePath = relative(rootDir, filePath).replaceAll("\\", "/");
  const html = readFileSync(filePath, "utf8");

  if (!/<title>[\s\S]*?<\/title>/i.test(html)) {
    errors.push(`${relativePath}: missing <title>`);
  }

  if (!hasNonEmptyDescription(html)) {
    warnings.push(`${relativePath}: missing non-empty meta description`);
  }

  if (/href=["']#["']/i.test(html)) {
    errors.push(`${relativePath}: contains placeholder href=\"#\" links`);
  }

  if (/cache:\s*['"]no-store['"]/i.test(html)) {
    errors.push(`${relativePath}: contains cache:'no-store' and bypasses static caching`);
  }

  if (html.includes('/scripts/global-nav.js')) {
    if (/<nav\s+class=["'](?:main-nav|top-nav)["']/i.test(html)) {
      errors.push(`${relativePath}: ships local nav markup while also loading shared global-nav.js`);
    }

    if (/const\s+nav\s*=\s*document\.querySelector\(['"]\.main-nav['"]\)/i.test(html)) {
      errors.push(`${relativePath}: contains page-local nav JS while also loading shared global-nav.js`);
    }
  }

  if (servicePagePaths.has(relativePath)) {
    if (!html.includes('/styles/service-pages.css')) {
      errors.push(`${relativePath}: service page must load /styles/service-pages.css`);
    }

    if (/<style>/i.test(html)) {
      errors.push(`${relativePath}: service page still contains inline <style> instead of shared stylesheet`);
    }

    if (!/<body[^>]*class=["'][^"']*\bservice-page\b/i.test(html)) {
      errors.push(`${relativePath}: service page is missing the service-page body class`);
    }
  }

  validateScriptsInHead(html, relativePath, errors);
}

if (errors.length) {
  console.error("Source checks failed:\n");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

if (warnings.length) {
  console.warn("Source checks warnings:\n");
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
  console.warn("");
}

console.log(`Source checks passed for ${htmlFiles.length} HTML files.`);
