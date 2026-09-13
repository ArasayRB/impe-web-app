import type { MiddlewareHandler } from 'astro';
import { resolveSite } from '@/lib/resolveSite';
import { LOCAL_SITES } from '@/lib/site';

export const siteMiddleware: MiddlewareHandler = async (
  context,
  next
) => {
  const host =
    context.request.headers.get('host') || '';
	const hostname =
  host.split(':')[0];

  /**
   * Public website hosts
   *
   * These hosts must be resolved by the public
   * website runtime, using the Host header.
   *
   * Examples:
   *
   *   landing.ijoba-saas.localhost
   *   empresa1.ijoba-saas.localhost
   *   cliente.com
   *   cliente.ijoba-saas.com
   *
   * They must NOT use:
   *   - website cookie
   *   - ?site=
   *   - X-Website
   *   - a fallback LOCAL_SITES[0]
   */
  const isLocalPublicWebsite =
  hostname === 'ijoba-saas.localhost' ||
  hostname.endsWith('.ijoba-saas.localhost');

  const baseDomain =
    import.meta.env.PUBLIC_WEBSITE_DOMAIN ||
    'ijoba-saas.com';

  const isProductionPublicWebsite =
    hostname  === baseDomain ||
    hostname .endsWith(`.${baseDomain}`);

  const isPublicWebsite =
    isLocalPublicWebsite ||
    isProductionPublicWebsite;
		
  if (isPublicWebsite) {
    /**
     * Public website context
     *
     * We intentionally do not call resolveSite().
     *
     * The public website will later resolve the actual
     * Website and snapshot from the backend using Host.
     */
    context.locals.isPublicWebsite = true;
    context.locals.publicHost = host;

    return next();
  }

  /**
   * Existing private/application behavior
   *
   * Keep the current Site resolution untouched.
   */
  const site = resolveSite(context);

  if (!site) {
    return new Response(
      'Website not found',
      { status: 404 }
    );
  }

  context.cookies.set(
    'website',
    site.slug,
    {
      path: '/',
    }
  );

  context.locals.site = site;
  context.locals.locale =
    site.locale || 'en';

  context.locals.isPublicWebsite = false;

  return next();
};
