import { atom } from 'nanostores';
import type { Locale } from '@/lib/i18n/type';

export const localeStore = atom<Locale | null>(null);
export const i18nVersion = atom(0); // 🔥 trigger reactive

export function setLocale(locale: Locale) {
  localeStore.set(locale);
}
