// src/services/api.server.ts
import type { APIContext } from 'astro';
import type { Site } from '@/lib/site';
import { ApiError } from '@/lib/api.error';
import { logError } from '@/lib/logger';

const API_URL = import.meta.env.PUBLIC_API_URL;

export async function apiFetchServer(
  url: string,
  options: RequestInit = {},
  request?: Request,
  site? : Site,
  signal?: AbortSignal, 
  timeout = 8000
) {

  const timeoutController = new AbortController();

  const id = setTimeout(

      () => timeoutController.abort(),

      timeout

  );

  const finalSignal = signal

      ? AbortSignal.any([

          signal,

          timeoutController.signal

      ])

      : timeoutController.signal;

  if (!site) {
    logError('Missing tenant', { url, headers: options.headers });
    throw new ApiError(
      'Missing tenant',
      400,
     'TENANT_NOT_RESOLVED'
    );
  }
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Website': site.slug,
    'Accept' : 'application/json',
    ...(options.headers || {}),
  };

  // 🔥 cookies del request SSR
  const cookieHeader = request?.headers?.get('cookie') || '';
  
  const cookies = Object.fromEntries(
    cookieHeader
      ? cookieHeader.split('; ').map(c => {
          const [k, v] = c.split('=');
          return [k, decodeURIComponent(v || '')];
        })
      : []
  );

  //  DEVICE
  const deviceHash = cookies.device_hash;

  if (deviceHash) {
    headers['X-Device-Hash'] = deviceHash;
  }

  if (cookieHeader) {
    headers['cookie'] = cookieHeader;
  }

  //  AUTH
  const authRaw = cookies.auth;

  let token;

  try {
    const parsed = JSON.parse(authRaw || '{}');
    token = parsed.accessToken;
  } catch {
    console.log('TOKEN NOT FOUND',authRaw);
  }
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  console.log('[API SSR] OUTGOING REQUEST', {
    url,
    website: headers['X-Website'],
    hasCookie: !!headers.cookie,
    device: headers['X-Device-Hash']?.slice(0, 6) // no logs completos
  });

  // log antes del fetch
  logError('Outgoing request', { url, headers, deviceHash, cookieHeader });
  try {
    const res = await fetch(import.meta.env.PUBLIC_API_URL + url, {
      ...options,
      headers,
      signal: finalSignal,
    });
    if (!res.ok) {
      
      let message = 'API error';
      let code = undefined;

      try {
        const data = await res.json();
        message = data.message || message;
        code = data.code;
      } catch {
        const text = await res.text();
        message = text || message;
      }
      logError('API response error', { url, status: res.status, message });
      if (res.status === 401) {

      throw new ApiError(
          'Unauthenticated',
          401,
          'UNAUTHENTICATED'
        );
      }
      throw new ApiError(message, res.status, code);
    }

    return res.json();
  } catch (err: any) {

      // El request fue cancelado por el usuario
      if (signal?.aborted) {

          throw err;

      }

      // Timeout real
      if (
          err.name === "AbortError" ||
          err.code === "UND_ERR_HEADERS_TIMEOUT"
      ) {

          logError(
              "Fetch exception before ApiError",
              {
                  url,
                  err: {
                      message: err.message,
                      code: err.code,
                      name: err.name
                  }
              }
          );

          throw new ApiError(
              "Request timeout",
              408,
              "TIMEOUT"
          );

      }

      logError(
          "Fetch exception",
          {
              url,
              err: {
                  message: err.message,
                  code: err.code,
                  name: err.name
              }
          }
      );

      throw new ApiError(
          err.name,
          408,
          err.code
      );

  }
  finally {

      clearTimeout(id);

  }
  
}
