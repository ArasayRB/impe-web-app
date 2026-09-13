// src/lib/resolveSite.ts
import type { Site } from './site';
import { LOCAL_SITES } from './site';

export function resolveSite(context: any): Site | null {
  const request = context.request;

  const url =
    context.url instanceof URL
      ? context.url
      : new URL(request.url);

  const host =
    request.headers.get('host') || '';

  const cookieHeader =
    request.headers.get('cookie') || '';

  const cookies = Object.fromEntries(
    cookieHeader
      .split('; ')
      .filter(Boolean)
      .map(c => {
        const [k, ...rest] = c.split('=');

        return [
          k,
          decodeURIComponent(rest.join('=') || '')
        ];
      })
  );

  /*
   * Authenticated/private context.
   *
   * The auth cookie contains the complete authentication
   * response, including user.business.website.
   */
  const authCookie = cookies.auth;

  if (authCookie) {
    try {
      const session = JSON.parse(authCookie);
      const website = session?.user?.business?.website;

      if (website?.id && website?.slug) {
        console.log(
          '[SITE RESOLVED FROM AUTH COOKIE]',
          website.slug
        );

        return website as Site;
      }
    } catch {
      // Invalid auth cookie. Continue with normal fallback.
    }
  }

  /*
   * Fallback for local/development/authentication pages
   * where there is no authenticated session yet.
   */
  const websiteFromCookie =
    cookies.website;

  if (websiteFromCookie) {
    const localSite = LOCAL_SITES.find(
      site => site.slug === websiteFromCookie
    );

    if (localSite) {
      console.log(
        '[SITE RESOLVED FROM WEBSITE COOKIE]',
        localSite.slug
      );

      return localSite;
    }
  }

  /*
   * Resolve local/prod development host.
   */
  const hostname =
    host.split(':')[0];

  const hostParts =
    hostname.split('.');

  const subdomain =
    hostParts.length > 2
      ? hostParts[0]
      : null;

  if (subdomain) {
    const prodSite = LOCAL_SITES.find(
      site => site.slug === subdomain
    );

    if (prodSite) {
      return prodSite;
    }
  }

  /*
   * Local development fallback.
   */
  const siteFromQuery =
    url.searchParams.get('site');

  if (siteFromQuery) {
    const localSite = LOCAL_SITES.find(
      site => site.slug === siteFromQuery
    );

    if (localSite) {
      return localSite;
    }
  }

  return LOCAL_SITES[0] ?? null;
}
