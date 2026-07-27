import type { Site } from '@/lib/site';

export function mapSiteFromUser(user: any): Site {
  const business = user.businesses?.[0];
  if (!business?.website) {
    throw new Error('User has no website assigned');
  }

  return {
    id: business.website.id,
    slug: business.website.slug,       // peluqueria-corte-moderno
    url: business.website.url,       // test.ijoba.com
    locale: business.website.locale, // es
    title: business.website.title,
  };
}
