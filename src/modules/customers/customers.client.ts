import { apiClientFetch } from '@/services/api.client';
import type { CustomerResponse, CustomerFilters } from './customers.types';

export async function listCustomersClient(
  filters: CustomerFilters = {},
  signal?: AbortSignal 
): Promise<CustomerResponse> {
  const query = new URLSearchParams(filters as any).toString();

  return apiClientFetch(`/v1/customers?${query}`,{},true,signal);
}

export async function bulkCustomersClient(
	customers: any[]
) {
	return apiClientFetch(
		'/v1/bulk/customers',
		{
			method: 'POST',
			body: JSON.stringify({
				customers
			})
		}
	);
}

export async function bulkDeleteCustomersClient(
	ids: number[]
) {
	return apiClientFetch(
		'/v1/bulk/customers/delete',
		{
			method: 'DELETE',
			body: JSON.stringify({
				ids
			})
		}
	);
}

export async function getCustomersAnalyticsClient(
  filters: Record<string, any>
) {
  return apiClientFetch(
    '/v1/analytics/customers?' +
    new URLSearchParams(filters)
  );
}

export async function createCustomerClient(
  data: any
){
  return apiClientFetch(`/v1/customers`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// UPDATE
export async function updateCustomerClient(
  id: number | string,
  data: any
) {
  return apiClientFetch(`/v1/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// DELETE
export async function deleteCustomerClient(id: number | string) {
  return apiClientFetch(`/v1/customers/${id}`, {
    method: 'DELETE',
  });
}

export async function searchCustomersClient(query: string) {
  return apiClientFetch(`/v1/customers?search=${query}`);
}