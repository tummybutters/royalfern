import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { renderServiceDetailPage } from "../templates/service-detail-page.mjs";
import { renderServicesOverviewPage } from "../templates/services-overview-page.mjs";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const defaultRootDir = resolve(scriptDir, "..");
const contentDir = "content/services";

export function generateServicePages({ rootDir = defaultRootDir } = {}) {
  const pages = loadServiceContent(rootDir);

  for (const page of pages) {
    const html = renderPage(page);
    const outputPath = resolve(rootDir, page.outputPath);
    writeFileSync(outputPath, html, "utf8");
  }

  return pages.map((page) => page.outputPath);
}

function loadServiceContent(rootDir) {
  const absoluteContentDir = resolve(rootDir, contentDir);

  return readdirSync(absoluteContentDir)
    .filter((fileName) => extname(fileName) === ".json")
    .sort()
    .map((fileName) => {
      const filePath = join(absoluteContentDir, fileName);
      return JSON.parse(readFileSync(filePath, "utf8"));
    });
}

function renderPage(page) {
  if (page.template === "overview") {
    return renderServicesOverviewPage(page);
  }

  if (page.template === "detail") {
    return renderServiceDetailPage(page);
  }

  throw new Error(`Unknown service page template: ${page.template}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const changedFiles = generateServicePages();
  console.log(`Generated ${changedFiles.length} service routes.`);
}
