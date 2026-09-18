import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';

const DEV_PORT = 2121;

const site =
  process.env.PUBLIC_SITE_URL ||
  `http://localhost:${DEV_PORT}`;

export default defineConfig({
  site,

  base: undefined,

  output: 'server',

  adapter: node({
    mode: 'standalone',
  }),

  server: {
    host: true,
    port: DEV_PORT,
  },

  integrations: [
    sitemap({
      filter: (page) => {
        return (
          page === `${site}/es` ||
          page === `${site}/en`
        );
      },
    }),

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
