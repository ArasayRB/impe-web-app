import { loadNamespace } from './loader';
import { localeStore } from './store';

export async function t(
  key: string,
  namespace: string = 'common'
): Promise<string> {
  const locale = localeStore.get();

  const messages = await loadNamespace(locale, namespace);

  return resolveKey(messages, key) || key;
}

function resolveKey(obj: any, path: string): string {
  return path.split('.').reduce((acc, part) => {
    return acc?.[part];
  }, obj);
}