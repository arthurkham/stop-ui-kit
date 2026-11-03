import tailwindcss from '@tailwindcss/vite';
import { defineLibraryConfig } from '../../tooling/vite-library.js';

export default defineLibraryConfig({
  root: import.meta.dirname,
  plugins: [tailwindcss()],
  cssFileName: 'styles',
});
