import { initLocaleFromDOM } from '@/lib/i18n/initLocale.client';
import { initI18n } from '@/lib/i18n/i18n';
import { lang } from '@/lib/i18n/config';
import { bindI18n } from '@/lib/i18n/useI18n';

export async function bootstrapClient() {
  initLocaleFromDOM();

  await initI18n(lang);

  bindI18n(document.body);
}