import { t } from './i18n';

export function resolveTranslation(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(resolveTranslation);
  }

  if (typeof obj === 'object' && obj !== null) {
    const res: any = {};

    for (const key in obj) {
      if (key === 'label' && typeof obj[key] === 'string') {
        res[key] = t(obj[key]);
      } else {
        res[key] = resolveTranslation(obj[key]);
      }
    }

    return res;
  }

  return obj;
}
