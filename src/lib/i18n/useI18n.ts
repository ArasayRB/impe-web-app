// lib/i18n/useI18n.ts
import { i18nVersion } from '@/lib/i18n/store';
import { t } from '@/lib/i18n/i18n';

export function bindI18n(root: HTMLElement) {
  const update = () => {
    root.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      console.log(
        'UPDATING',
        key,
        t(key)
      );

      if (!key) return;

      el.textContent = t(key);
    });
  };

  // initial render
  update();

  // reactive render
  return i18nVersion.subscribe(() => {
    console.log('I18N DOM UPDATE');
    update();
  });
}
