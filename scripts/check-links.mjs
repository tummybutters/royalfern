import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, normalize, relative, resolve } from "node:path";

const rootDir = process.cwd();
const distDir = join(rootDir, "dist");
const missing = [];

function collectHtmlFiles(dir, results = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      collectHtmlFiles(fullPath, results);
      continue;
    }

    if (stats.isFile() && entry.endsWith(".html")) {
      results.push(fullPath);
    }
  }

  return results;
}

function isIgnorableUrl(url) {
  return (
    !url ||
    url.startsWith("#") ||
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:") ||
    url.startsWith("data:") ||
    url.startsWith("javascript:")
  );
}

function resolveCandidate(filePath, url) {
  const cleanUrl = url.split("#")[0].split("?")[0];
  const absolutePath = cleanUrl.startsWith("/")
    ? join(distDir, cleanUrl)
    : resolve(dirname(filePath), cleanUrl);

  const candidates = [absolutePath];

  if (cleanUrl.endsWith("/")) {
    candidates.push(join(absolutePath, "index.html"));
  } else if (!/\.[a-z0-9]+$/i.test(cleanUrl)) {
    candidates.push(`${absolutePath}.html`);
    candidates.push(join(absolutePath, "index.html"));
  }

  return [...new Set(candidates.map((path) => normalize(path)))];
}

for (const filePath of collectHtmlFiles(distDir)) {
  const html = readFileSync(filePath, "utf8");
  const references = [...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)];

  for (const [, url] of references) {
    if (isIgnorableUrl(url)) continue;

    const candidates = resolveCandidate(filePath, url);
    if (!candidates.some((candidate) => existsSync(candidate))) {
      missing.push(`${relative(rootDir, filePath)} -> ${url}`);
    }
  }
}

if (missing.length) {
  console.error("Broken local links/assets found in dist:\n");
  for (const entry of missing) {
    console.error(`- ${entry}`);
  }
  process.exit(1);
}

console.log("Link checks passed for dist HTML output.");
