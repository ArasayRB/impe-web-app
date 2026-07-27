// src/middlewares/site.middleware.ts
import type { MiddlewareHandler } from 'astro';
import { resolveSite } from '@/lib/resolveSite';
import { LOCAL_SITES } from '@/lib/site';

export const siteMiddleware: MiddlewareHandler = async (context, next) => {
  const accept = context.request.headers.get('accept') || '';
  /*if (!accept.includes('text/html')) {
    return next();
  }*/

  const site = resolveSite(context);
  
  if (!site) {
    return new Response('Website not found', { status: 404 });
  }

  // persist in cookie
  context.cookies.set('website', site.slug, {
    path: '/',
  });

  context.locals.site = site;
  context.locals.locale = site.locale || 'en';

  return next();
};

export async function onRequest({ request, locals }, next) {
  const url = new URL(request.url);

  const host = request.headers.get('host') || '';

  // 🔥 1. detectar subdominio
  let subdomain: string | null = null;

  if (host.includes('.')) {
    const parts = host.split('.');
    if (parts.length > 2) {
      subdomain = parts[0]; // tenant.tudominio.com
    }
  }

  // 🔥 2. query fallback (dev)
  const querySite = url.searchParams.get('site');

  // 🔥 3. cookie fallback
  const cookieSite = request.headers
    .get('cookie')
    ?.match(/website=([^;]+)/)?.[1];

  const slug =
    subdomain || querySite || cookieSite || null;

  const site =
    LOCAL_SITES.find(s => s.slug === slug) ||
    LOCAL_SITES[0];

  locals.site = site;

  return next();
}
