import { setSession, clearSession  } from '@/lib/session';
import { redirectAfterLogin } from './redirectAfterLogin';
import { setCookie, clearCookie  } from '@/lib/cookie';
import { loginApi, logoutApi, verify2FA, resend2FACodeEmail  } from '@/modules/auth/auth.service';

const TWO_FA_TOKEN = '2fa_token';
const TWO_FA_METHOD = '2fa_method';

export async function login(email: string, password: string, remember = false) {
  const data = await loginApi(email, password, remember);
  console.log('path',location.pathname,data);
  // 🔥 CASE 1: requieres 2FA
  if (data.requires_2fa) {
    set2FAToken(data.tmp_token);
    set2FAMethod(data.two_factor.default);
    return data;
  }

  // 🔥 CASE 2: direct login
  if (data?.accessToken) {
    setSession(data);
    setCookie(data);
    const site = data.user?.business?.website;

      if (site) {
        redirectAfterLogin(site);
      } else {
        window.location.href = '/';
      }
  }

  return data;
}

export function redirectToLogin(){
  window.location.href = '/authentication/sign-in';
}

export async function logout() {
  try {
    await logoutApi();
  } catch {}

  clearSession();
  clearCookie();

  redirectToLogin();
}

//2FA functions
export function set2FAToken(token: string) {
  localStorage.setItem(TWO_FA_TOKEN, token);
}

export function get2FAToken(): string | null {
  return localStorage.getItem(TWO_FA_TOKEN);
}

export function set2FAMethod(method: string) {
  localStorage.setItem(TWO_FA_METHOD, method);
}

export function get2FAMethod(): string | null {
  return localStorage.getItem(TWO_FA_METHOD);
}

export function clear2FAToken() {
  localStorage.removeItem(TWO_FA_TOKEN);
}

export function clear2FAMethod() {
  localStorage.removeItem(TWO_FA_METHOD);
}

export async function verifyTwoFactor(code: string) {
  const token = get2FAToken();
  const method = get2FAMethod();

  if (!token || !method) {
    throw new Error('2FA token missing');
  }

  let endpoint = '';

  if (method === 'totp') {
    endpoint = '/auth/2fa/app/verify';
  }

  if (method === 'email') {
    endpoint = '/auth/2fa/verify';
  }

  const data = await verify2FA(token, code, endpoint);

  // save real
  setSession(data);
  setCookie(data);

  // clean temporal token
  clear2FAToken();
  // clean method
  clear2FAMethod();

  return data;
}

export async function triggerEmail2FA() {
  const token = get2FAToken();
  let endpoint = '/auth/2fa/resend';

  if (!token) {
    throw new Error('Session expired');
  }

  await resend2FACodeEmail(token, endpoint);

  
}
