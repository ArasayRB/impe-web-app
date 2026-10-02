// src/modules/permissions/permissions.server.ts

import { apiFetchServer } from '@/services/api.server';

import type {
  PermissionsResponse,
  PermissionsFilters
} from './permissions.types';

import type { Site } from '@/lib/site';


// LIST
export async function listPermissionsServer(
  request: Request,
  filters: PermissionsFilters = {},
  site: Site
): Promise<PermissionsResponse> {

  const query = new URLSearchParams(
    filters as any
  ).toString();

  return apiFetchServer(
    `/v1/permissions?${query}`,
    {},
    request,
    site
  );
}


// GET PERMISSION
export async function getPermissionServer(
  permissionId: number | string,
  request: Request,
  site: Site
) {

  return apiFetchServer(
    `/v1/permissions/${permissionId}`,
    {},
    request,
    site
  );
}
