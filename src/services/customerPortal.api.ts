import { getCustomerPortalToken } from '@/lib/session';
import { showLoader, hideLoader } from '@/lib/loader';
import { ApiError } from '@/lib/api.error';

export async function customerPortalApiFetch(
  url: string,
  options: RequestInit = {},
  signal?: AbortSignal
) {
  const isFormData =
    options.body instanceof FormData;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getCustomerPortalToken();
 

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  showLoader();

  const mergedHeaders = {
    ...(options.headers || {}),
    ...headers,
  };

  try {
    const res = await fetch(
      import.meta.env.PUBLIC_API_URL + url,
      {
        ...options,
        headers: mergedHeaders,
        signal,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new ApiError(
        data.message || 'API error',
        res.status,
        data.code
      );
    }

    return data;
  } finally {
    hideLoader();
  }
}
