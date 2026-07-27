import { isAuthenticated, getUser, subscribeAuth } from '@/lib/session';
import { renderProfile } from './profile.template';
import { renderLoginBtn } from './login.template';

const USER_KEY = 'user';

export function mountAuth(el: HTMLElement) {
  if (!el) return;

  function render() {
    if (!isAuthenticated()) {
      el.innerHTML = renderLoginBtn();
      return;
    }

    const user = getUser();
    if (!user) return;

    el.innerHTML = renderProfile(user);
  }

  render();

  // 🔥 reactivo
  subscribeAuth(render);
}
