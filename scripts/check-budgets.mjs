import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const rootDir = process.cwd();
const kb = 1024;
const budgets = [
  { label: "dist/index.html", path: "dist/index.html", maxBytes: 105 * kb },
  { label: "dist/about/index.html", path: "dist/about/index.html", maxBytes: 16 * kb },
  { label: "dist/gallery/index.html", path: "dist/gallery/index.html", maxBytes: 22 * kb },
  { label: "dist/services/index.html", path: "dist/services/index.html", maxBytes: 10 * kb },
  { label: "dist/styles/global-nav.css", path: "dist/styles/global-nav.css", maxBytes: 10 * kb },
  { label: "dist/styles/service-pages.css", path: "dist/styles/service-pages.css", maxBytes: 12 * kb },
  { label: "public/data/google-reviews.json", path: "public/data/google-reviews.json", maxBytes: 50 * kb },
];

const errors = [];

for (const budget of budgets) {
  const fullPath = join(rootDir, budget.path);
  const size = statSync(fullPath).size;
  if (size > budget.maxBytes) {
    errors.push(`${budget.label} is ${size} bytes, above budget ${budget.maxBytes} bytes`);
  }
}

const heroVideoDir = join(rootDir, "public/media/hero");
const heroVideos = readdirSync(heroVideoDir).filter((file) => file.endsWith(".mp4"));
const heroVideoSizes = heroVideos.map((file) => ({
  file,
  size: statSync(join(heroVideoDir, file)).size,
}));
const totalHeroVideoBytes = heroVideoSizes.reduce((sum, video) => sum + video.size, 0);

if (totalHeroVideoBytes > 4.2 * kb * kb) {
  errors.push(`public/media/hero total video weight is ${totalHeroVideoBytes} bytes, above budget ${Math.round(4.2 * kb * kb)} bytes`);
}

for (const video of heroVideoSizes) {
  if (video.size > 1.2 * kb * kb) {
    errors.push(`public/media/hero/${video.file} is ${video.size} bytes, above budget ${Math.round(1.2 * kb * kb)} bytes`);
  }
}

const galleryHero = statSync(join(rootDir, "public/media/gallery/gallery-hero-wide.jpg")).size;
if (galleryHero > 520 * kb) {
  errors.push(`public/media/gallery/gallery-hero-wide.jpg is ${galleryHero} bytes, above budget ${520 * kb} bytes`);
}

if (errors.length) {
  console.error("Performance budgets failed:\n");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Performance budgets passed.");
