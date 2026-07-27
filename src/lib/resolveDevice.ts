// src/lib/resolveDevice.ts

export function resolveDevice(context?: any): string {
  // SSR: context.request.headers
  if (context?.request?.headers) {
    const cookieHeader = context.request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader
        ? cookieHeader.split('; ').map(c => {
            const [k, v] = c.split('=');
            return [k, decodeURIComponent(v || '')];
          })
        : []
    );

    if (cookies.device_hash) {
      console.log('[DEVICE RESOLVED FROM COOKIE SSR]', cookies.device_hash);
      return cookies.device_hash;
    }
  }

  // CSR: fallback a localStorage / cookie del navegador
  if (typeof window !== 'undefined') {
    let device = localStorage.getItem('device_hash');
    if (!device) {
      device = crypto.randomUUID();
      localStorage.setItem('device_hash', device);
      document.cookie = `device_hash=${device}; path=/; samesite=lax`;
      console.log('[DEVICE GENERATED CSR]', device);
    } else {
      console.log('[DEVICE RESOLVED FROM LOCALSTORAGE CSR]', device);
    }
    return device;
  }

  // Fallback genérico
  console.warn('No device hash found, generating temporary one');
  return crypto.randomUUID();
}