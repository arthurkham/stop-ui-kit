import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import postcss from 'postcss';
import type { Plugin } from 'vite';
import { isolateStyles } from '../../tooling/isolate-css.js';
import { defineLibraryConfig } from '../../tooling/vite-library.js';

const root = import.meta.dirname;

/**
 * Ships two stylesheets built from the same source: `styles.layer.css` keeps kit styles in the
 * `components` cascade layer, and `styles.css` is the isolated default (see tooling/isolate-css.js).
 */
function emitStylesheets(): Plugin {
  return {
    name: 'stop-ui:emit-stylesheets',
    async writeBundle() {
      const layered = readFileSync(resolve(root, 'dist/styles.css'), 'utf8');
      const isolated = await postcss([isolateStyles()]).process(layered, { from: undefined });
      writeFileSync(resolve(root, 'dist/styles.layer.css'), layered);
      writeFileSync(resolve(root, 'dist/styles.css'), isolated.css);
    },
  };
}

export default defineLibraryConfig({
  root,
  plugins: [tailwindcss(), emitStylesheets()],
  cssFileName: 'styles',
});
