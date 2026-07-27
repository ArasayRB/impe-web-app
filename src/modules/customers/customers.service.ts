import type { CustomerFilters } from './customers.types';
import { getSite } from '@/lib/site.store';
import type { Site } from '@/lib/site';

function ensureSite(site?: Site): Site {
  if (!site) {
    throw new Error('[Service] Site is required in SSR');
  }
  return site;
}

export async function listCustomers(
  request?: Request,
  filters: CustomerFilters = {},
  site?: Site,
  signal?: AbortSignal 
) {
  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();

  console.log('[SERVICE] site', resolvedSite);

  if (import.meta.env.SSR) {
    try {
      const { listCustomersServer } = await import('./customers.server');
      return listCustomersServer(request!, filters, resolvedSite,signal);
    } catch (e:any) {
      if (e.code === 'TIMEOUT') {
        return {
          data: [],
          meta: {},
          error: {
            message: 'Timeout fetching customers',
            code: 'TIMEOUT'
          }
        };
      }

      throw e; // errors reals go on
    }
  }

  try {
    const { listCustomersClient } = await import('./customers.client');
    return listCustomersClient(filters,signal);
  } catch (e:any) {
    if (e.code === 'TIMEOUT') {
        return {
          data: [],
          meta: {},
          error: {
            message: 'Timeout fetching customers',
            code: 'TIMEOUT'
          }
        };
      }

      throw e; // errors reals go on
  }
}

export async function bulkDeleteCustomers(
	ids: number[],
  request?: Request,
  site?: Site
) {

  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();

  if (import.meta.env.SSR) {
    const { bulkDeleteCustomersServer } = await import('./customers.server');
    return bulkDeleteCustomersServer(ids, request!, resolvedSite);
  }

  const { bulkDeleteCustomersClient } = await import('./customers.client');
  return bulkDeleteCustomersClient(ids);
}

export async function bulkCustomers(
	customers: any[],
  request?: Request,
  site?: Site
) {

  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();

  if (import.meta.env.SSR) {
    const { bulkCustomersServer } = await import('./customers.server');
    return bulkCustomersServer(customers, request!, resolvedSite);
  }

  const { bulkCustomersClient } = await import('./customers.client');
  return bulkCustomersClient(customers);
}

export async function getCustomersAnalytics(
  filters: Record<string, any> = {},
  request?: Request,
  site?: Site
) {
  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();

  if (import.meta.env.SSR) {
    const { getCustomersAnalyticsServer } = await import('./customers.server');

    return getCustomersAnalyticsServer(filters,request!,resolvedSite);
  }

  const { getCustomersAnalyticsClient }= await import('./customers.client');

  return getCustomersAnalyticsClient(filters);
}

// STORE
export async function createCustomer(
  data: any,
  request?: Request,
  site?: Site
) {
  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();

  if (import.meta.env.SSR) {
    const { createCustomerServer } = await import('./customers.server');
    return createCustomerServer(data, request!, resolvedSite);
  }

  const { createCustomerClient } = await import('./customers.client');
  return createCustomerClient(data);
}

// UPDATE
export async function updateCustomer(
  id: number | string,
  data: any,
  request?: Request,
  site?: Site
) {
  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();

  if (import.meta.env.SSR) {
    const { updateCustomerServer } = await import('./customers.server');
    return updateCustomerServer(id, data, request!, resolvedSite);
  }

  const { updateCustomerClient } = await import('./customers.client');
  return updateCustomerClient(id, data);
}

// DELETE
export async function deleteCustomer(
  id: number | string,
  request?: Request,
  site?: Site
) {
  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();

  if (import.meta.env.SSR) {
    const { deleteCustomerServer } = await import('./customers.server');
    return deleteCustomerServer(id, request!, resolvedSite);
  }

  const { deleteCustomerClient } = await import('./customers.client');
  return deleteCustomerClient(id);
}

export async function searchCustomers(query: string) {
  const { searchCustomersClient } = await import('./customers.client');
  const res = await searchCustomersClient(query);
console.log('data',res);
  return {
    data: res.data.data, // normalized
  };
}
