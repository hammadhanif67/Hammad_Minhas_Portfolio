import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { seoPlugin } from './vite/seo';

export default defineConfig({
  plugins: [
    react(),
    // Writes canonical, Open Graph, Twitter and the JSON-LD @graph into
    // index.html, and emits robots.txt and sitemap.xml — all from the
    // same data files the components render, so nothing can drift.
    seoPlugin(),
  ],
  build: {
    target: 'es2020',
    // The tubes field is the heaviest thing on the page and nothing
    // above the fold needs it. HeroField reaches it through a dynamic
    // import, which is enough for the bundler to split it out.
    chunkSizeWarningLimit: 800,
  },
});
