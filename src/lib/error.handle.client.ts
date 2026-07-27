
import { get2FAMethod, triggerEmail2FA, redirectToLogin } from '@/modules/auth/auth.client.ts';
import { map2FAError } from '@/lib/mappers/2faerror.mapper.ts';
import { t } from '@/lib/i18n/i18n';
		
// center error handle
export function handleError(err, errorEl) {
    const type = map2FAError(err.message);
    switch (type) {
        case 'INVALID_CODE':
        errorEl.textContent = t('auth.errors.INVALID_CODE');
        break;

        case 'EXPIRED':
        errorEl.textContent = t('auth.errors.EXPIRED');
        showResendOption(errorEl);
        break;

        case 'LOCKED':
        errorEl.textContent =
            t('auth.errors.LOCKED');
        break;

        case 'INVALID_SESSION':
        errorEl.textContent =
            t('auth.errors.INVALID_SESSION');
        redirectToLogin();
        break;

        default:
        errorEl.textContent = t('auth.errors.UNKNOWN');
    }

    errorEl.classList.remove('hidden');
}

export function handleLoginError(err, errorEl) {
  const msg = err.message || '';

  if (msg.includes('Invalid credentials')) {
    errorEl.textContent = t('auth.errors.INVALID_CREDENTIALS');
  } else if (msg.includes('Too many attempts')) {
    errorEl.textContent = t('auth.errors.LOCKED');
  } else {
    errorEl.textContent = t('auth.errors.INVALID_CREDENTIALS');
  }

  errorEl.classList.remove('hidden');
}

export function showResendOption(errorEl) {
    const method = get2FAMethod();

    if (method !== 'email') return;

    let btn = document.getElementById('resendBtn');

    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'resendBtn';
        btn.textContent = t('auth.actions.resend');;
        btn.className = 'mt-4 text-blue-500';

        btn.onclick = async () => {
            try {
                await triggerEmail2FA();
                errorEl.textContent = t('auth.messages.code_sent');;
            } catch (e) {
                errorEl.textContent = e.message;
            }
        };

        errorEl.appendChild(btn);
    }
}
