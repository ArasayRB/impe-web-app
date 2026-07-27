import { apiFetch } from '@/services/api';
import { redirectToLogin  } from './auth.client';
import { getSession, clearSession, setSession  } from '@/lib/session';
import { setCookie, clearCookie  } from '@/lib/cookie';

const API_URL = import.meta.env.PUBLIC_API_URL;

export async function loginApi(email: string, password: string, remember = false) {
  return apiFetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  },{
    skipAuth: true, // IMPORTANT!!!
  });
}

export async function refreshTokenApi() {
  const session = getSession();
  const token = session.refresh;

  if (token) {
    try{
      return await apiFetch('/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: token }),
      });
    } catch (e) {
      console.warn('Refresh API failed, continuing client refresh');
    }
  }
}

export async function logoutApi() {
  const session = getSession();
  const token = session.token;

  if (token) {
    try {
      await apiFetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (e) {
      console.warn('Logout API failed, continuing client logout');
    }
  }

  // local clean
  clearSession();
  clearCookie()

  // Redirect
  redirectToLogin();
}

export async function signup(data) {
  return apiFetch(
    '/register?invitation_code=155d9f0e-e995-4dd5-899a-2ac6994212c0',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );
}

export async function verify2FA(tmp_token: string, code: string, endpoint: string) {
  return apiFetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tmp_token, code }),
  }, {
    skipAuth: true,
  });
}

export async function resend2FACodeEmail(tmp_token: string, endpoint: string) {
  return apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({ tmp_token }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

