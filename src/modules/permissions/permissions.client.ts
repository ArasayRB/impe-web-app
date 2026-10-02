// src/modules/permissions/permissions.client.ts

import { apiClientFetch } from '@/services/api.client';

import type {
  PermissionsResponse,
  PermissionsFilters
} from './permissions.types';


// LIST
export async function listPermissionsClient(
  filters: PermissionsFilters = {}
): Promise<PermissionsResponse> {

  const query = new URLSearchParams(
    filters as any
  ).toString();

  return apiClientFetch(
    `/v1/permissions?${query}`
  );
}


// GET PERMISSION
export async function getPermissionClient(
  permissionId: number | string
) {

  return apiClientFetch(
    `/v1/permissions/${permissionId}`,
    {}
  );
}
