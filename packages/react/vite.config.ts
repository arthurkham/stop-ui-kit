import { copyFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineLibraryConfig } from '../../tooling/vite-library.js';

const root = import.meta.dirname;

/**
 * Ships the compiled stylesheets as `@stop-ui/react/styles.css` (isolated) and
 * `@stop-ui/react/styles.layer.css` (layered) for a single-package setup.
 */
function copyStylesheets(): Plugin {
  return {
    name: 'stop-ui:copy-stylesheets',
    writeBundle() {
      const require = createRequire(resolve(root, 'package.json'));
      for (const file of ['styles.css', 'styles.layer.css']) {
        copyFileSync(require.resolve(`@stop-ui/styles/${file}`), resolve(root, 'dist', file));
      }
    },
  };
}

export default defineLibraryConfig({
  root,
  plugins: [react(), copyStylesheets()],
});
