// src/lib/publicWebsiteLocale.ts
export const PUBLIC_WEBSITE_LOCALES = [
  'es',
  'en',
] as const;

export type PublicWebsiteLocale =
  typeof PUBLIC_WEBSITE_LOCALES[number];

export const DEFAULT_PUBLIC_WEBSITE_LOCALE:
  PublicWebsiteLocale = 'es';

export function isPublicWebsiteLocale(
  value: string
): value is PublicWebsiteLocale {
  return PUBLIC_WEBSITE_LOCALES.includes(
    value as PublicWebsiteLocale
  );
}
