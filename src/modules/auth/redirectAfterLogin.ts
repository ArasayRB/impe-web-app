import type { Site } from '@/lib/site';

export function redirectAfterLogin(site: Site) {
  const isProd = location.hostname !== 'localhost'; 
  if (isProd) {
    window.location.href = `https://${site.slug}.${location.hostname}`;
  } else {
    window.location.href = `/?site=${site.slug}`;
  }
}
