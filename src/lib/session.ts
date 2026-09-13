//src/lib/session.ts
const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';
const USER_KEY = 'user';
const WEBSITE_KEY = 'website';
const DEVICE_KEY = 'device_hash';
const LOGO_KEY  = 'logo';


const ACCESS_EXP_KEY = 'access_expires_at';
const REFRESH_EXP_KEY = 'refresh_expires_at';

const CUSTOMER_PORTAL_TOKEN_KEY = 'customer_portal_token';
const CUSTOMER_PORTAL_CUSTOMER_KEY = 'customer_portal_customer';


const listeners = new Set<Function>();

function notify() {
  listeners.forEach(fn => fn());
}


export function getSession() {
  return {
    token: localStorage.getItem(TOKEN_KEY),
    refresh: localStorage.getItem(REFRESH_KEY),
    user: localStorage.getItem(USER_KEY),
    website: localStorage.getItem(WEBSITE_KEY),
    device: localStorage.getItem(DEVICE_KEY),
    logo: localStorage.getItem(LOGO_KEY),
  };
}

export function setSession(data: any) {
  localStorage.setItem(TOKEN_KEY, data.accessToken);
  localStorage.setItem(REFRESH_KEY, data.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));

  localStorage.setItem(ACCESS_EXP_KEY, data.accessTokenExpiresAt);
  localStorage.setItem(REFRESH_EXP_KEY, data.refreshTokenExpiresAt);

  const website = data.user?.business?.website;

  if (website?.slug) {
    localStorage.setItem(WEBSITE_KEY, website.slug);
  }

  if (website?.logo) {
    localStorage.setItem(LOGO_KEY, website.logo);
  }
  notify();
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(WEBSITE_KEY);
  localStorage.removeItem(ACCESS_EXP_KEY);
  localStorage.removeItem(REFRESH_EXP_KEY);
  localStorage.removeItem(LOGO_KEY);

  //We can not remove device from session never
  notify();
}

export function getDeviceHash() {
  return localStorage.getItem(DEVICE_KEY) || '';
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

function isExpired(date: string | null): boolean {
  if (!date) return true;
  return new Date(date).getTime() < Date.now();
}

export function isAccessExpired() {
  return isExpired(localStorage.getItem(ACCESS_EXP_KEY));
}

export function isAuthenticated(): boolean {
  const token = getToken();
  return !!token && !isAccessExpired();
}

export function isRefreshExpired() {
  return isExpired(localStorage.getItem(REFRESH_EXP_KEY));
}

export function hasValidSession(session) {
  return !!session.token;
}

export function subscribeAuth(fn: Function) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

//CUSTOMER PORTAL FUNCTIONS
export function setCustomerPortalSession(data: any) {
  if (!data?.token) return;

  localStorage.setItem(
    CUSTOMER_PORTAL_TOKEN_KEY,
    data.token
  );

  if (data.customer) {
    localStorage.setItem(
      CUSTOMER_PORTAL_CUSTOMER_KEY,
      JSON.stringify(data.customer)
    );
  }
}

export function getCustomerPortalToken(): string | null {
  return localStorage.getItem(
    CUSTOMER_PORTAL_TOKEN_KEY
  );
}

export function getCustomerPortalCustomer() {
  const raw = localStorage.getItem(
    CUSTOMER_PORTAL_CUSTOMER_KEY
  );

  return raw ? JSON.parse(raw) : null;
}

export function clearCustomerPortalSession() {
  localStorage.removeItem(
    CUSTOMER_PORTAL_TOKEN_KEY
  );

  localStorage.removeItem(
    CUSTOMER_PORTAL_CUSTOMER_KEY
  );
}
