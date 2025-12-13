import { getToken } from '../auth/auth';

const API_URL = import.meta.env.PUBLIC_API_URL;

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = getToken();

  const headers: HeadersInit = {
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    throw new Error('API error');
  }

  return res.json();
}
