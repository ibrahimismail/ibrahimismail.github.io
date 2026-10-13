// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ibrahimismail.dev',

  integrations: [sitemap()],

  build: {
    assets: 'assets',
    // /cv.html, served at /cv. The default (/cv/index.html) makes Cloudflare redirect every
    // link without a trailing slash, costing a round trip on each navigation and prefetch.
    format: 'file',
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
