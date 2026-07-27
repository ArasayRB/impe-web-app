import { sequence } from 'astro/middleware';
import { siteMiddleware } from './middlewares/site.middleware';
import { authMiddleware } from './middlewares/auth.middleware';

export const onRequest = sequence(
  siteMiddleware,
  authMiddleware
);
