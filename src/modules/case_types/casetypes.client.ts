import { apiClientFetch } from '@/services/api.client';
import type { CaseTypesResponse, CaseTypesFilters } from './casetypes.types';

export async function listCaseTypesClient(
  filters: CaseTypesFilters = {},
  signal?: AbortSignal 
): Promise<CaseTypesResponse> {
  const query = new URLSearchParams(filters as any).toString();

  return apiClientFetch(`/v1/case-types?${query}`,{},true,signal);
}

export async function bulkCaseTypesClient(
	casetypes: any[]
) {
	return apiClientFetch(
		'/v1/bulk/case-types',
		{
			method: 'POST',
			body: JSON.stringify({
				casetypes
			})
		}
	);
}

export async function bulkDeleteCaseTypesClient(
	ids: number[]
) {
	return apiClientFetch(
		'/v1/bulk/case-types/delete',
		{
			method: 'DELETE',
			body: JSON.stringify({
				ids
			})
		}
	);
}

export async function getCaseTypesAnalyticsClient(
  filters: Record<string, any>
) {
  return apiClientFetch(
    '/v1/analytics/case-types?' +
    new URLSearchParams(filters)
  );
}

export async function createCaseTypesClient(
  data: any
){
  console.log("FINAL Data to create", data,'using stringify',JSON.stringify(data));
  return apiClientFetch(`/v1/case-types`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// UPDATE
export async function updateCaseTypesClient(
  id: number | string,
  data: any
) {
  console.log("FINAL Data to edit", data);
  return apiClientFetch(`/v1/case-types/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// DELETE
export async function deleteCaseTypesClient(id: number | string) {
  return apiClientFetch(`/v1/case-types/${id}`, {
    method: 'DELETE',
  });
}

export async function searchCaseTypesClient(query: string) {
  return apiClientFetch(`/v1/case-types?search=${query}`);
}
