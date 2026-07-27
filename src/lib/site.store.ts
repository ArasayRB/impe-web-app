// src/lib/site.store.ts
import type { Site } from './site';

let currentSite: Site | null = null;

export function initSite(site: Site) {
  if (!site?.slug || !site?.id) {
    throw new Error('[Site] Invalid site object');
  }

  currentSite = site;
}

export function setSite(site: Site) {
  currentSite = site;
}

export function getSite(): Site {
  if (!currentSite) {
    throw new Error('Site not initialized');
  }
  return currentSite;
}
