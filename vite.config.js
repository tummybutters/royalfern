import { readdirSync } from 'node:fs';
import { dirname, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const rootDir = dirname(fileURLToPath(import.meta.url));
const ignoredDirs = new Set(['.git', 'dist', 'node_modules', 'public', 'tmp']);

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

export default defineConfig({
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: collectHtmlInputs(rootDir),
    },
  },
});
