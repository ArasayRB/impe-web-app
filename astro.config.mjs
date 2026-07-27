import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';

const DEV_PORT = 2121;

export default defineConfig({
  site: process.env.CI
    ? 'https://themesberg.github.io'
    : `http://localhost:${DEV_PORT}`,

  base: process.env.CI ? '/flowbite-astro-admin-dashboard' : undefined,

  output: 'server',

  adapter: node({
    mode: 'standalone',
  }),

  server: {
    port: DEV_PORT,
  },

  integrations: [
    sitemap(),
    tailwind(),
    mdx(),
  ],

  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
});
