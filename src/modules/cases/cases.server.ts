// cases.server.ts

import { apiFetchServer } from '@/services/api.server';
import type { CaseResponse, CaseFilters } from './cases.types';
import type { Site } from '@/lib/site';

export async function listCasesServer(
  request: Request,
  filters: CaseFilters = {},
  site : Site
): Promise<CaseResponse> {
  const query = new URLSearchParams(filters as any).toString();
console.log('REQUEST',request);
  return apiFetchServer(`/v1/cases?${query}`, {}, request, site);
}



export async function getCasesAnalyticsServer(
  filters: Record<string, any>,
  request: Request,
  site: Site
) {
  return apiFetchServer(
    '/v1/analytics/cases?' +
    new URLSearchParams(filters),
    {}, // options
    request,
    site
  );
}

// UPDATE
export async function createCaseServer(
  data: any,
  request: Request,
  site: Site
) {
  return apiFetchServer(
    `/v1/cases`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    request,
    site
  );
}

// UPDATE
export async function updateCaseServer(
  id: number | string,
  data: any,
  request: Request,
  site: Site
) {
  return apiFetchServer(
    `/v1/cases/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    request,
    site
  );
}

// DELETE
export async function deleteCaseServer(
  id: number | string,
  request: Request,
  site: Site
) {
  return apiFetchServer(
    `/v1/cases/${id}`,
    {
      method: 'DELETE',
    },
    request,
    site
  );
}
