import { setLocale } from '@/lib/i18n/store';

export function initLocaleFromDOM() {
  if (typeof window === 'undefined') return;

  // 1. cookie manda
  const cookieLocale =
    document.cookie.match(/locale=([^;]+)/)?.[1];

  if (cookieLocale) {
    setLocale(cookieLocale as any);
    return;
  }

  // 2. fallback a SSR (html lang)
  const htmlLocale = document.documentElement.lang;

  if (htmlLocale) {
    setLocale(htmlLocale as any);
    return;
  }
  setLocale('en');
}
