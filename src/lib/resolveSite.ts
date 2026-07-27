// src/lib/resolveSite.ts
import type { Site } from './site';
import { LOCAL_SITES } from './site';
import { ApiError } from './api.error';

export function resolveSite(context: any): Site {
  const request = context.request;

  // 🔑 AQUÍ está la corrección clave
  const url =
    context.url instanceof URL
      ? context.url
      : new URL(request.url);

  /**
   * PRODUCCIÓN — subdominio o dominio
   */
  const host = request.headers.get('host') || '';

  /**
   * COOKIE (PRIORIDAD ALTA en SSR autenticado)
   */
  const cookieHeader = request.headers.get('cookie') || '';

  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(c => {
      const [k, v] = c.split('=');
      return [k, decodeURIComponent(v || '')];
    })
  );

  const websiteFromCookie = cookies.website;

  if (websiteFromCookie) {
    const site = LOCAL_SITES.find(
      s => s.slug === websiteFromCookie
    );

    if (site) {
      console.log('[SITE RESOLVED FROM COOKIE]', site.slug);
      return site;
    }
  }

  /**
   * DOMINIO / SUBDOMINIO (producción)
   */
  const subdomain = host.split('.')[0];

  const prodSite = LOCAL_SITES.find(
    site =>
      site.slug === subdomain 
  );

  if (prodSite) return prodSite;

  /**
   * LOCAL — query ?site=empresa1
   */
  const siteFromQuery = url.searchParams.get('site');
  if (siteFromQuery) {
    const localSite = LOCAL_SITES.find(
      site => site.slug === siteFromQuery
    );
    if (localSite) return localSite;
  }

  /**
   * Fallback (solo para local/dev)
   */
  return LOCAL_SITES[0];
}
