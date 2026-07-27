//src/services/apt.ts
import { getSession, getDeviceHash, clearSession } from '@/lib/session';
import { showLoader, hideLoader } from '@/lib/loader';
import { ensureValidSession } from '@/lib/auth';

const API_URL = import.meta.env.PUBLIC_API_URL;

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  config: { skipAuth?: boolean; } = {}
) {

  try {
    if (!config.skipAuth) {
      await ensureValidSession();
    }
  } catch (e) {
    if (e?.message === 'SESSION_EXPIRED') {
      window.location.href = '/authentication/sign-in';
      return;
    }

    throw e;
  }

  const session = getSession();

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> ?? {}),
  };

  //  AUTH
  if (session.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  //  TENANT
  if (session.website) {
    headers['X-Website'] = session.website;
  }

  //  DEVICE
  let deviceHash = getDeviceHash();
  headers['X-Device-Hash'] = deviceHash;

  showLoader();
  try{
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    //  AUTO LOGOUT
    if (res.status === 401) {
      if (!config.skipAuth) {
        clearSession();
        window.location.href = '/authentication/sign-in';
      }

      const text = await res.text();
      throw new Error(text || 'Unauthorized');
    }

    if (!res.ok) {
      let message = 'Unexpected error';
      try {
        const data = await res.json();
        message = data.message || message;
      } catch {
        const text = await res.text();
        message = text;
      }

      throw new Error(message);
    }

    return res.json();
  
  }finally {
    hideLoader();
  }
}
