import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = resolve(rootDir, "content/site-data.json");
const templatePath = resolve(rootDir, "scripts/global-nav.template.js");
const outputPath = resolve(rootDir, "public/scripts/global-nav.js");

const [rawData, template] = await Promise.all([
  readFile(dataPath, "utf8"),
  readFile(templatePath, "utf8"),
]);

const rendered = template.replace("__SITE_DATA__", JSON.stringify(JSON.parse(rawData), null, 2));
await writeFile(outputPath, rendered);
