import { setSession, getSession, getToken  } from '@/lib/session';
import { setCookie, getCookie  } from '@/lib/cookie';

let refreshing: Promise<any> | null = null;

export async function refreshAuth() {
  if (refreshing) return refreshing;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',

  };

  refreshing = (async () => {
    const raw = getCookie('auth');

    if (!raw) throw new Error('No auth');

    const device_hash = getCookie('device_hash');

    const session = JSON.parse(decodeURIComponent(raw));
  
    headers['X-Device-Hash'] = device_hash;

    const res = await fetch(
      `${import.meta.env.PUBLIC_API_URL}/refresh`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          refresh_token: session.refreshToken,
        }),
      }
    );

    if (!res.ok) throw new Error('Refresh failed');

    const data = await res.json();console.log('Data from refresh',data);

    if (data?.accessToken) {
      setSession(data);
      console.log('[SESSION AFTER REFRESH]', data);
      console.log('[GET TOKEN AFTER REFRESH]', getToken());
      setCookie(data);
    }

    return data;
  })();

  try {
    return await refreshing;
  } catch (e) {
		throw e;
	}finally {
    refreshing = null;
  }
}

export function getAuthHeaders() {
  const session = getSession();
  return {
    Authorization: `Bearer ${session?.token}`,
  };
}
