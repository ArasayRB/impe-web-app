// src/services/public.website.service.ts
import type { Site } from '@/lib/site';

export interface PublicWebsiteSnapshot {
  site: Record<string, any>;
  branding: Record<string, any>;
  theme: Record<string, any>;
  company: Record<string, any>;
  seo: Record<string, any>;
  navigation: Record<string, any>;
  sections: Record<string, any>;
  cta: Record<string, any>;
  legal: Record<string, any>;
  contact: Record<string, any>;
  social: any[];
  team: Record<string, any>;
  structured_data: any[];
}

interface PublicWebsiteSnapshotResponse {
  success: boolean;
  data?: PublicWebsiteSnapshot;
  message?: string;
}

export interface PublicContactPayload {
  [key: string]: unknown;
}

export interface PublicContactResponse {
  success: boolean;
  message?: string;
  data?: Record<string, any>;
}

export async function getPublicWebsiteSnapshot(
  request: Request,
  site?: Site | null
): Promise<PublicWebsiteSnapshot | null> {
  const apiUrl =
    import.meta.env.PUBLIC_API_URL;

  if (!apiUrl) {
    console.error(
      '[PUBLIC WEBSITE] PUBLIC_API_URL is not configured'
    );

    return null;
  }

  let host =
    request.headers.get('host') || '';

		if (site?.domain) {
			host = site.subdomain
				? `${site.subdomain}.${site.domain}`
				: site.domain;
		}

  try {
    const response = await fetch(
      `${apiUrl}/v1/public/website/snapshot`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-Public-Host': host,
        },
      }
    );

    if (!response.ok) {
      console.error(
        '[PUBLIC WEBSITE] Snapshot request failed',
        {
          status: response.status,
          host,
          response,
          url: `${apiUrl}/v1/public/website/snapshot`,
        }
      );

      return null;
    }

    const result =
      (await response.json()) as PublicWebsiteSnapshotResponse;

    if (
      !result.success ||
      !result.data
    ) {
      console.error(
        '[PUBLIC WEBSITE] Invalid snapshot response',
        result
      );

      return null;
    }

    console.log(
      'Result service',
      result
    );

    return result.data;
  } catch (error) {
    console.error(
      '[PUBLIC WEBSITE] Snapshot request error',
      error
    );

    return null;
  }
}

export async function submitPublicContact(
  host: string,
  endpoint: string,
  payload: PublicContactPayload
): Promise<PublicContactResponse> {
  const apiUrl =
    import.meta.env.PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error(
      '[PUBLIC WEBSITE] PUBLIC_API_URL is not configured'
    );
  }

  if (!endpoint) {
    throw new Error(
      '[PUBLIC WEBSITE] Contact endpoint is not configured'
    );
  }

  const url =
    new URL(
      endpoint,
      apiUrl.endsWith('/')
        ? apiUrl
        : `${apiUrl}/`
    ).toString();

  const response =
    await fetch(
      url,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
					'X-Public-Host':host,
        },
        body: JSON.stringify(payload),
      }
    );

  let result:
    PublicContactResponse;

  try {
    result =
      (await response.json()) as PublicContactResponse;
  } catch {
    result = {
      success: false,
      message:
        'Invalid response from server',
    };
  }

  if (!response.ok) {
    throw new Error(
      result.message ||
      'Contact submission failed'
    );
  }

  return result;
}
