import { isAuthenticated } from './auth';

export function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = '/authentication/sign-in';
  }
}
