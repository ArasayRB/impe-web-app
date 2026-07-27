import { logout } from '@/modules/auth/auth.client';

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;

  const el = target.closest('[data-action="logout"]');
  if (!el) return;

  e.preventDefault();
  logout();
});
