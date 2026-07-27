import { loadNamespace } from '@/lib/i18n/loader';
import {
  localeStore,
  setLocale,
  i18nVersion,
} from '@/lib/i18n/store';

import { lang } from '@/lib/i18n/config';

let messages: Record<string, any> = {};
let readyPromise: Promise<void> | null = null;

export function waitForI18n() {
  return readyPromise;
}

export async function initI18n(
  requiredNamespaces: string[] = []
) {
  readyPromise = (async () => {
    const locale = localeStore.get();

    messages = {};

    for (const ns of requiredNamespaces) {
      messages[ns] = await loadNamespace(
        locale,
        ns
      );
    }
  })();

  return readyPromise;
}

export async function reloadI18n(
  requiredNamespaces: string[] = []
) {
  await initI18n(requiredNamespaces);
}

export async function changeLanguage(
  locale: 'en' | 'es'
) {
  setLocale(locale);

  document.documentElement.lang = locale;

  await reloadI18n(lang);

  i18nVersion.set(
    i18nVersion.get() + 1
  );
}

export function t(key: string): string {
  const [ns, ...rest] = key.split('.');

  const path = rest.join('.');

  const namespace = messages[ns];

  if (!namespace) {
    return key;
  }

  return (
    path
      .split('.')
      .reduce(
        (acc, part) => acc?.[part],
        namespace
      ) || key
  );
}