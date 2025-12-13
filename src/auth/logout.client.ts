import { logout } from './auth';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-action="logout"]').forEach((el) => {
    el.addEventListener('click', (e) => {console.log('logout')
      e.preventDefault();
      logout();
    });
  });
});
