import { readdirSync } from 'node:fs';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Every *.html file in the app root is a page with its own entry and stylesheets.
const pages = readdirSync(import.meta.dirname).filter((file) => file.endsWith('.html'));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { rollupOptions: { input: pages } },
});
