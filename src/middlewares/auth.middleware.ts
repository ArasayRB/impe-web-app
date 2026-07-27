import type { MiddlewareHandler } from 'astro';
import { logError } from '@/lib/logger';
import { setSession, clearSession, getSession  } from '@/lib/session';
import { setCookie, clearCookie  } from '@/lib/cookie';

const AUTH_ROUTES = [
  '/authentication/sign-in',
  '/authentication/sign-up',
  '/authentication/2fa',
];


export const authMiddleware: MiddlewareHandler = async (context, next) => {
  const { pathname } = context.url;

  const accept = context.request.headers.get('accept') || '';
  const isPageRequest = accept.includes('text/html');

  // 🔥 IGNORAR assets / fetch / etc.
  if (!isPageRequest) {
    return next();
  }

  const isAuthRoute = AUTH_ROUTES.some(r => pathname.startsWith(r));

  if (isAuthRoute) {
    return next();
  }

  const raw = context.cookies.get('auth')?.value;
  logError('Checking auth cookie', { pathname, raw });
  if (!raw) {
    return Response.redirect(new URL('/authentication/sign-in', context.url));
  }

  let session;

  try {
    session = JSON.parse(decodeURIComponent(raw));
  } catch {
    context.cookies.delete('auth');
    return Response.redirect(new URL('/authentication/sign-in', context.url));
  }

  if (!session?.refreshToken || !session?.accessTokenExpiresAt) {
    context.cookies.delete('auth');
    return Response.redirect(new URL('/authentication/sign-in', context.url));
  }

  const now = Date.now();
  const accessExpiresAt = new Date(session.accessTokenExpiresAt).getTime();
  const refreshExpiresAt = new Date(session.refreshTokenExpiresAt).getTime();

  if (now > refreshExpiresAt) {
    context.cookies.delete('auth');
    return Response.redirect(new URL('/authentication/sign-in', context.url));
  }
  logError('Checking auth middleware cookie', { pathname, session });
  if (now > accessExpiresAt) {
    try {
      const res = await fetch(`${import.meta.env.PUBLIC_API_URL}/refresh`, {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json',
            'X-Device-Hash': session.device || ''
        },
        body: JSON.stringify({ refresh_token: session.refreshToken }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      if (data?.accessToken) {
        clearSession();
        setSession(data);
        setCookie(data);
      }

    } catch {
      context.cookies.delete('auth');
      return Response.redirect(new URL('/authentication/sign-in', context.url));
    }
  }

  return next();
};