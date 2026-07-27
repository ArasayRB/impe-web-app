import { refreshTokenApi  } from '@/modules/auth/auth.service';
import { redirectToLogin  } from '@/modules/auth/auth.client';
import { setSession, getSession, clearSession, isAccessExpired, isRefreshExpired } from '@/lib/session';
import { setCookie, clearCookie  } from '@/lib/cookie';

let isRefreshing = false;

export async function ensureValidSession() {
  const session = getSession();

  //  1. NOT session → nothing to do
  if (!session?.token || !session?.refresh) {
    return;
  }
  if (!isAccessExpired()) return;

  if (isRefreshExpired()) {
    clearSession();
    clearCookie();
    throw new Error('SESSION_EXPIRED');
  }

  if (isRefreshing) return;

  isRefreshing = true;

  try {

    const data = await refreshTokenApi();

    if (data?.accessToken) {
      setSession(data);
      setCookie(data);
    }else{
      throw new Error('INVALID_REFRESH');
    }

  } catch {
    clearSession();
    clearCookie();
    throw new Error('SESSION_EXPIRED');
  } finally {
    isRefreshing = false;
  }
}
