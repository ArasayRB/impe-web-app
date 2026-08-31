// cases.server.ts

import { apiFetchServer } from '@/services/api.server';
import type { CaseResponse, CaseFilters, CaseWorkflowResponse } from './cases.types';
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

export async function getCaseWorkflowServer(
	id: number | string,
	request: Request,
	site: Site
): Promise<CaseWorkflowResponse> {
	return apiFetchServer(
		`/v1/cases/${id}/workflow`,
		{},
		request,
		site
	);
}

export async function getCaseDocumentsServer(
	id: number | string,
	request: Request,
	site: Site
) {
	return apiFetchServer(
		`/v1/cases/${id}/documents`,
		{},
		request,
		site
	);
}

export async function uploadCaseDocumentServer(
	id: number | string,
	data: FormData,
	request: Request,
	site: Site
) {
	return apiFetchServer(
		`/v1/cases/${id}/documents`,
		{
			method: 'POST',
			body: data
		},
		request,
		site
	);
}

export async function generateCaseDocumentServer(
	id: number | string,
	data: any,
	request: Request,
	site: Site
) {
	return apiFetchServer(
		`/v1/cases/${id}/documents/generate`,
		{
			method: 'POST',
			body: JSON.stringify(data)
		},
		request,
		site
	);
}

// DELETE
export async function deleteCaseDocumentServer(
  id: number | string,
  request: Request,
  site: Site
) {
  return apiFetchServer(
    `/v1/cases/documents/${id}`,
    {
      method: 'DELETE',
    },
    request,
    site
  );
}
