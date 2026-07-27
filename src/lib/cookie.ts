export function getSessionFromCookie(context) {
  const raw = context.cookies.get('auth')?.value;

  if (!raw) return null;

  try {
    const session = JSON.parse(decodeURIComponent(raw));

    return {
      token: session.accessToken,
      website: context.cookies.get('website')?.value,
      logo: context.cookies.get('logo')?.value,
    };
  } catch {
    return null;
  }
}

export function setCookie(data: any) {
  // ONLY save cookie if session REAL
  if (!data?.accessToken) return;

  const isProd = location.protocol === 'https:';

  document.cookie = `auth=${encodeURIComponent(JSON.stringify(data))}; path=/; ${
    isProd ? 'secure;' : ''
  } samesite=lax`;

  const website = data.user?.business?.website;

  if (website?.slug) {
    document.cookie = `website=${website.slug}; path=/; ${
      isProd ? 'secure;' : ''
    } samesite=lax`;
  }

  if (website?.logo) {
    document.cookie = `logo=${website.logo}; path=/; ${
      isProd ? 'secure;' : ''
    } samesite=lax`;
  }

  const device = localStorage.getItem('device_hash');
  if (device) {
    document.cookie = `device_hash=${device}; path=/; ${
      isProd ? 'secure;' : ''
    } samesite=lax`;
  }
}

export function clearCookie() {
  const isProd = location.protocol === 'https:';
  document.cookie = `auth=; path=/; ${
      isProd ? 'secure;' : ''
    } samesite=lax`;
  document.cookie = `website=; path=/; ${
      isProd ? 'secure;' : ''
    } samesite=lax`;
}

export function getCookie(name: string) {
  return document.cookie
    .split('; ')
    .find(c => c.startsWith(`${name}=`))
    ?.split('=')[1];
}
