export function isAuthenticated(): boolean {
  return !!localStorage.getItem('auth_token');
}

export function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function logout(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user'); // si lo usas luego
  window.location.href = '/authentication/sign-in';
}
