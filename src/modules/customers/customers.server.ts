// customers.server.ts

import { apiFetchServer } from '@/services/api.server';
import type { CustomerResponse, CustomerFilters } from './customers.types';
import type { Site } from '@/lib/site';

export async function listCustomersServer(
  request: Request,
  filters: CustomerFilters = {},
  site : Site,
  signal?: AbortSignal 
): Promise<CustomerResponse> {
  const query = new URLSearchParams(filters as any).toString();
console.log('REQUEST',request);
  return apiFetchServer(`/v1/customers?${query}`, {}, request, site, signal);
}

export async function bulkCustomersServer(
	customers: any[],
  request: Request,
  site: Site
) {
	return apiClientFetch(
		'/v1/bulk/customers',
		{
			method: 'POST',
			body: JSON.stringify({
				customers
			})
		},
    request,
    site
	);
}

export async function bulkDeleteCustomersServer(
	ids: number[],
  request: Request,
  site: Site
) {
	return apiClientFetch(
		'/v1/bulk/customers/delete',
		{
			method: 'DELETE',
			body: JSON.stringify({
				ids
			})
		},
    request,
    site
	);
}

export async function getCustomersAnalyticsServer(
  filters: Record<string, any>,
  request: Request,
  site: Site
) {
  return apiFetchServer(
    '/v1/analytics/customers?' +
    new URLSearchParams(filters),
    {}, // options
    request,
    site
  );
}

// UPDATE
export async function createCustomerServer(
  data: any,
  request: Request,
  site: Site
) {
  return apiFetchServer(
    `/v1/customers`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    request,
    site
  );
}

// UPDATE
export async function updateCustomerServer(
  id: number | string,
  data: any,
  request: Request,
  site: Site
) {
  return apiFetchServer(
    `/v1/customers/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    request,
    site
  );
}

// DELETE
export async function deleteCustomerServer(
  id: number | string,
  request: Request,
  site: Site
) {
  return apiFetchServer(
    `/v1/customers/${id}`,
    {
      method: 'DELETE',
    },
    request,
    site
  );
}
