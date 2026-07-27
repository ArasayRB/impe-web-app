export function formatDate(date: Date, locale = 'es-ES') {
  return date instanceof Date && !isNaN(date.getTime())
    ? date.toLocaleDateString(locale)
    : '';
}