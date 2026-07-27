// src/services/api.client.ts

import { getSite } from '@/lib/site.store';
import { getDeviceHash, clearSession, getToken } from '@/lib/session';
import { clearCookie  } from '@/lib/cookie';
import { showLoader, hideLoader } from '@/lib/loader';
import { ApiError } from '@/lib/api.error';
import { refreshAuth, getAuthHeaders } from '@/services/auth.client';

export async function apiClientFetch(url: string, options: RequestInit = {}, retry = true,signal?: AbortSignal ) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const token = getToken(); // ← usa localStorage
  const site = getSite();

  if (site) {
    headers['X-Website'] = site.slug;
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  showLoader(); // ✅ START

  //  DEVICE
  let deviceHash = getDeviceHash();
  headers['X-Device-Hash'] = deviceHash;


  console.log('[API CLIENT]', {
    url,
    website: headers['X-Website'],
    auth: !!headers['Authorization'],
    device: headers['X-Device-Hash']?.slice(0, 6)
  });
  

  const mergedHeaders = {
    ...(options.headers || {}),
    ...headers, //  YOUR TOKEN ALWAYS WIN
  };
  try {
    console.log('[TOKEN SENT]', mergedHeaders,headers.Authorization, mergedHeaders.Authorization);
    const res = await fetch(import.meta.env.PUBLIC_API_URL + url, {
      ...options,
      headers: mergedHeaders,
      signal
    });

    if (res.status === 401) {
      try {
        await refreshAuth();

        // 🔁 retry request
        return apiClientFetch(url, 
        {
          ...options,
          headers: undefined, // force reconstruction
          signal,
        },
			false);
      } catch {
        clearSession();
        clearCookie();
        window.location.href = '/authentication/sign-in';
        return;
      }
    }
    
    const data = await res.json();

		if (!res.ok) {

				throw new ApiError(
						data.message || 'API error',
						res.status,
						data.code
				);

		}


    return data;
  } catch (error) {
    throw error;
  }finally {
    hideLoader(); // ✅ END Allways
  }
}
