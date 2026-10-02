// src/modules/roles/roles.server.ts

import { apiFetchServer } from '@/services/api.server';

import type {
  RolesResponse,
  RolesFilters
} from './roles.types';

import type { Site } from '@/lib/site';


// LIST
export async function lisRolesServer(
  request: Request,
  filters: RolesFilters = {},
  site: Site
): Promise<RolesResponse> {

  const query = new URLSearchParams(
    filters as any
  ).toString();

  return apiFetchServer(
    `/v1/roles?${query}`,
    {},
    request,
    site
  );
}


// GET ROLE
export async function getRoleServer(
  roleId: number | string,
  request: Request,
  site: Site
) {

  return apiFetchServer(
    `/v1/roles/${roleId}`,
    {},
    request,
    site
  );
}

// GET ROLE Permissions
export async function getRolePermissionsServer(
	roleId: number | string,
	request: Request,
	site: Site
) {

  return apiFetchServer(
    `/v1/roles/${roleId}/permissions`,
    {},
    request,
    site
  );
}

