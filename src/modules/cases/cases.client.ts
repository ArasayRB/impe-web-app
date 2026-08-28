// cases.client.ts

import { apiClientFetch } from '@/services/api.client';
import type { CaseResponse, CaseFilters } from './cases.types';

export async function listCasesClient(
  filters: CaseFilters = {}
): Promise<CaseResponse> {
  const query = new URLSearchParams(filters as any).toString();console.log('filters',filters,'query',query)

  return apiClientFetch(`/v1/cases?${query}`);
}

export async function getCasesAnalyticsClient(
  filters: Record<string, any>
) {
  return apiClientFetch(
    '/v1/analytics/cases?' +
    new URLSearchParams(filters)
  );
}

export async function createCaseClient(
  data: any
){
  return apiClientFetch(`/v1/cases`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// UPDATE
export async function updateCaseClient(
  id: number | string,
  data: any
) {
  return apiClientFetch(`/v1/cases/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// DELETE
export async function deleteCaseClient(id: number | string) {
  return apiClientFetch(`/v1/cases/${id}`, {
    method: 'DELETE',
  });
}

export async function getCaseDocumentsClient(
	id: number | string
) {
	return apiClientFetch(
		`/v1/cases/${id}/documents`
	);
}

export async function uploadCaseDocumentClient(
	id: number | string,
	data: FormData
) {
	return apiClientFetch(
		`/v1/cases/${id}/documents`,
		{
			method: 'POST',
			body: data
		}
	);
}

export async function generateCaseDocumentClient(
	id: number | string,
	data: any
) {
	return apiClientFetch(
		`/v1/cases/${id}/documents/generate`,
		{
			method: 'POST',
			body: JSON.stringify(data)
		}
	);
}

// DELETE DOCUMENT
export async function deleteCaseDocumentClient(id: number | string) {
  return apiClientFetch(`/v1/cases/documents/${id}`, {
    method: 'DELETE',
  });
}
