import { redirectToLogin } from '@/modules/auth/auth.client';
import { t } from '@/lib/i18n/i18n';

export function handleApiError(err: any, errorEl?: HTMLElement) {
  const message = err?.message || 'Unexpected error';

  // 🔐 auth
  if (err?.status === 401) {
    redirectToLogin();
    return;
  }

  // ⏱ timeout
  if (err?.code === 'TIMEOUT') {
    show(errorEl, t('common.errors.TIMEOUT'));
    return;
  }

  // default
  show(errorEl, message);
}

function show(el?: HTMLElement, msg?: string) {
  if (!el) return;

  el.textContent = msg || t('common.errors.UNKNOWN');
  el.classList.remove('hidden');
}
