import { copyFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineLibraryConfig } from '../../tooling/vite-library.js';

const root = import.meta.dirname;

/** Ships the compiled stylesheet as `@stop-ui/react/styles.css` for a single-package setup. */
function copyStylesheet(): Plugin {
  return {
    name: 'stop-ui:copy-stylesheet',
    writeBundle() {
      const require = createRequire(resolve(root, 'package.json'));
      copyFileSync(require.resolve('@stop-ui/styles/styles.css'), resolve(root, 'dist/styles.css'));
    },
  };
}

export default defineLibraryConfig({
  root,
  plugins: [react(), copyStylesheet()],
});
