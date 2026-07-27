export function resolveLocale(context: any) {
  // 1. cookie (usuario manda)
  const cookieLocale = context.cookies.get('locale')?.value;
  if (cookieLocale) return cookieLocale;

  // 2. tenant (fallback)
  const siteLocale = context.locals.site?.locale;
  if (siteLocale) return siteLocale;

  // 3. default
  return 'en';
}
