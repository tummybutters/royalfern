import { readdirSync } from 'node:fs';
import { dirname, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { generateServicePages } from './scripts/generate-service-pages.mjs';

const rootDir = dirname(fileURLToPath(import.meta.url));
const ignoredDirs = new Set(['.git', 'dist', 'node_modules', 'public', 'tmp']);
const serviceGenerationWatchRoots = [
  resolve(rootDir, 'content/services'),
  resolve(rootDir, 'templates'),
  resolve(rootDir, 'scripts/generate-service-pages.mjs'),
];

function collectHtmlInputs(dir, inputs = {}) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = resolve(dir, entry.name);

    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        collectHtmlInputs(fullPath, inputs);
      }
      continue;
    }

    if (!entry.isFile() || extname(entry.name) !== '.html') {
      continue;
    }

    const relativePath = relative(rootDir, fullPath).replaceAll('\\', '/');
    const entryName = relativePath === 'index.html'
      ? 'index'
      : relativePath.replace(/\/index\.html$/, '').replace(/\.html$/, '');

    inputs[entryName] = fullPath;
  }

  return inputs;
}

function runServiceGeneration() {
  generateServicePages({ rootDir });
}

function servicePageGenerationPlugin() {
  return {
    name: 'service-page-generation',
    buildStart() {
      runServiceGeneration();
    },
    configureServer(server) {
      server.watcher.add(serviceGenerationWatchRoots);

      const regenerateIfNeeded = (file) => {
        if (serviceGenerationWatchRoots.some((watchRoot) => file.startsWith(watchRoot))) {
          runServiceGeneration();
        }
      };

      server.watcher.on('add', regenerateIfNeeded);
      server.watcher.on('change', regenerateIfNeeded);
      server.watcher.on('unlink', regenerateIfNeeded);
    },
  };
}

runServiceGeneration();

export default defineConfig({
  appType: 'mpa',
  plugins: [servicePageGenerationPlugin()],
  build: {
    rollupOptions: {
      input: collectHtmlInputs(rootDir),
    },
  },
});
