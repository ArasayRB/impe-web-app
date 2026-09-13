import { setSession, clearSession  } from '@/lib/session';
import { redirectAfterLogin } from './redirectAfterLogin';
import { setCookie, clearCookie  } from '@/lib/cookie';
import { loginApi, logoutApi, verify2FA, resend2FACodeEmail  } from '@/modules/auth/auth.service';

const TWO_FA_TOKEN = '2fa_token';
const TWO_FA_METHOD = '2fa_method';


export function redirectToNoBusiness() { window.location.href = '/access/no-business'; }

export async function login( email: string, password: string, remember = false ) { const data = await loginApi( email, password, remember ); console.log( 'path', location.pathname, data ); if (data.requires_2fa) { set2FAToken(data.tmp_token); set2FAMethod(data.two_factor.default); return data; } if (data?.access_token) { const site = data.user?.business?.website; /* * A platform user must have a Business with * a valid Website before entering the dashboard. * * Do not create a session when the user has * no operational Website. */ if (!site) { clearSession(); clearCookie(); redirectToNoBusiness(); return null; } setSession(data); setCookie(data); redirectAfterLogin(site); } return data; }

export function redirectToLogin(){
  window.location.href = '/authentication/sign-in';
}

export async function logout() { try { await logoutApi(); } catch {} clearSession(); clearCookie(); redirectToLogin(); }

//2FA functions
export function set2FAToken(token: string) { sessionStorage.setItem( TWO_FA_TOKEN, token ); }

export function get2FAToken(): string | null { return sessionStorage.getItem( TWO_FA_TOKEN ); }

export function set2FAMethod(method: string) { sessionStorage.setItem( TWO_FA_METHOD, method ); } export function get2FAMethod(): string | null { return sessionStorage.getItem( TWO_FA_METHOD ); }

export function clear2FAToken() { sessionStorage.removeItem( TWO_FA_TOKEN ); }

export function clear2FAMethod() { sessionStorage.removeItem( TWO_FA_METHOD ); } export async function verifyTwoFactor( code: string ) { const token = get2FAToken(); const method = get2FAMethod(); if (!token || !method) { throw new Error( '2FA token missing' ); } let endpoint = ''; if (method === 'totp') { endpoint = '/auth/2fa/app/verify'; } if (method === 'email') { endpoint = '/auth/2fa/verify'; } const data = await verify2FA( token, code, endpoint ); /* * The 2FA response is the real authenticated * session. Validate the operational Website * before saving it. */ const site = data.user?.business?.website; if (!site) { clear2FAToken(); clear2FAMethod(); clearSession(); clearCookie(); redirectToNoBusiness(); return null; } setSession(data); setCookie(data); clear2FAToken(); clear2FAMethod(); return data; }

export async function triggerEmail2FA() {
  const token = get2FAToken();
  let endpoint = '/auth/2fa/resend';

  if (!token) {
    throw new Error('Session expired');
  }

  await resend2FACodeEmail(token, endpoint);

  
}
