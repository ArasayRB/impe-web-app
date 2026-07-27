import { t } from '@/lib/i18n/i18n';

export function mapAuthError(code: string) {
  return t(`auth.errors.${code}`);
}
