const modules = import.meta.glob('./locales/**/*.json');

const cache = new Map<string, any>();

export async function loadNamespace(locale: string, namespace: string) {
  const key = `${locale}:${namespace}`;

  if (cache.has(key)) return cache.get(key);

  const path = `./locales/${locale}/${namespace}.json`;

  const loader = modules[path];
  console.log('LOCALE', locale);
  console.log('PATH', path);
  console.log('FOUND', !!loader);

  if (!loader) {
    console.error(`Missing i18n file: ${path}`);

    // fallback
    if (locale !== 'en') {
      return loadNamespace('en', namespace);
    }

    return {};
  }

  const mod: any = await loader();
  const messages = mod.default;

  cache.set(key, messages);

  return messages;
}
