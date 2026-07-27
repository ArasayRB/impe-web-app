import type { CaseTypesFilters } from './casetypes.types';
import { getSite } from '@/lib/site.store';
import type { Site } from '@/lib/site';

function ensureSite(site?: Site): Site {
  if (!site) {
    throw new Error('[Service] Site is required in SSR');
  }
  return site;
}

export async function listCaseTypes(
  request?: Request,
  filters: CaseTypesFilters = {},
  site?: Site,
  signal?: AbortSignal
) {
  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();

  console.log('[SERVICE] site', resolvedSite);

  if (import.meta.env.SSR) {
    try {
      const { listCaseTypesServer } = await import('./casetypes.server');
      return listCaseTypesServer(request!, filters, resolvedSite,signal);
    } catch (e:any) {
      if (e.code === 'TIMEOUT') {
        return {
          data: [],
          meta: {},
          error: {
            message: 'Timeout fetching casetypess',
            code: 'TIMEOUT'
          }
        };
      }

      throw e; // errors reals go on
    }
  }

  try {
    const { listCaseTypesClient } = await import('./casetypes.client');
    return listCaseTypesClient(filters,signal);
  } catch (e:any) {
    if (e.code === 'TIMEOUT') {
        return {
          data: [],
          meta: {},
          error: {
            message: 'Timeout fetching casetypes',
            code: 'TIMEOUT'
          }
        };
      }

      throw e; // errors reals go on
  }
}

// STORE
export async function createCaseTypes(
  data: any,
  request?: Request,
  site?: Site
) {
  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();

  if (import.meta.env.SSR) {
    const { createCaseTypesServer } = await import('./casetypes.server');
    return createCaseTypesServer(data, request!, resolvedSite);
  }

  const { createCaseTypesClient } = await import('./casetypes.client');
  return createCaseTypesClient(data);
}

// UPDATE
export async function updateCaseTypes(
  id: number | string,
  data: any,
  request?: Request,
  site?: Site
) {
  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();

  if (import.meta.env.SSR) {
    const { updateCaseTypesServer } = await import('./casetypes.server');
    return updateCaseTypesServer(id, data, request!, resolvedSite);
  }

  const { updateCaseTypesClient } = await import('./casetypes.client');
  return updateCaseTypesClient(id, data);
}

// DELETE
export async function deleteCaseTypes(
  id: number | string,
  request?: Request,
  site?: Site
) {
  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();

  if (import.meta.env.SSR) {
    const { deleteCaseTypesServer } = await import('./casetypes.server');
    return deleteCaseTypesServer(id, request!, resolvedSite);
  }

  const { deleteCaseTypesClient } = await import('./casetypes.client');
  return deleteCaseTypesClient(id);
}

export async function searchCaseTypes(query: string) {
  const { searchCaseTypesClient } = await import('./casetypes.client');
  const res = await searchCaseTypesClient(query);
console.log('data',res);
  return {
    data: res.data.data, // normalized
  };
}
