// casetypes.server.ts

import { apiFetchServer } from '@/services/api.server';
import type { CaseTypesResponse, CaseTypesFilters } from './casetypes.types';
import type { Site } from '@/lib/site';

export async function listCaseTypesServer(
  request: Request,
  filters: CaseTypesFilters = {},
  site : Site,
  signal?: AbortSignal 
): Promise<CaseTypesResponse> {
  const query = new URLSearchParams(filters as any).toString();
console.log('REQUEST',request);
  return apiFetchServer(`/v1/case-types?${query}`, {}, request, site, signal);
}

// UPDATE
export async function createCaseTypesServer(
  data: any,
  request: Request,
  site: Site
) {
  return apiFetchServer(
    `/v1/case-types`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    request,
    site
  );
}

// UPDATE
export async function updateCaseTypesServer(
  id: number | string,
  data: any,
  request: Request,
  site: Site
) {
  return apiFetchServer(
    `/v1/case-types/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    request,
    site
  );
}

// DELETE
export async function deleteCaseTypesServer(
  id: number | string,
  request: Request,
  site: Site
) {
  return apiFetchServer(
    `/v1/case-types/${id}`,
    {
      method: 'DELETE',
    },
    request,
    site
  );
}
