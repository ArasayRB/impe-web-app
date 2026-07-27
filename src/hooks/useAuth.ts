import { isAccessExpired } from '@/lib/session';

export function useAuth() {
  function isAuthenticated() {
    const token = localStorage.getItem('access_token');
    return !!token && !isAccessExpired();
  }

  function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  return {
    isAuthenticated,
    getUser,
  };
}