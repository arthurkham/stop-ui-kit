import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { isolateStyles } from '../../tooling/isolate-css.js';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Storybook renders the kit with the default, isolated stylesheet, like most applications.
  css: { postcss: { plugins: [isolateStyles()] } },
});
