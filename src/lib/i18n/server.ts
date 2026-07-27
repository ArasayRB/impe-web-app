import { loadNamespace } from './loader';

export async function getServerTranslator(locale: string, namespaces: string[]) {
  const messages: Record<string, any> = {};

  for (const ns of namespaces) {
    messages[ns] = await loadNamespace(locale as any, ns as any);
  }

  function t(key: string): string {
    const [ns, ...rest] = key.split('.');
    const path = rest.join('.');

    const namespace = messages[ns];
    if (!namespace) return key;

    return (
      path.split('.').reduce((acc, part) => acc?.[part], namespace) || key
    );
  }

  return t;
}
