import { loadNamespace } from './loader';

const cache = new Map<string, any>();

export async function getTranslator(locale: string, namespace: string) {
  const key = `${locale}:${namespace}`;

  if (!cache.has(key)) {
    const messages = await loadNamespace(locale as any, namespace as any);
    cache.set(key, messages);
  }

  const messages = cache.get(key);

  function t(key: string): string {
    return key.split('.').reduce((acc, part) => acc?.[part], messages) || key;
  }

  return t;
}
