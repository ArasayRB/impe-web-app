// src/modules/roles/roles.client.ts

import { apiClientFetch } from '@/services/api.client';

import type {
  RolesResponse,
  RolesFilters
} from './roles.types';


// LIST
export async function listRolesClient(
  filters: RolesFilters = {}
): Promise<RolesResponse> {

  const query = new URLSearchParams(
    filters as any
  ).toString();

  return apiClientFetch(
    `/v1/roles?${query}`
  );
}


// GET ROLE
export async function getRoleClient(
  roleId: number | string
) {

  return apiClientFetch(
    `/v1/roles/${roleId}`,
    {}
  );
}

// GET ROLE Permissions
export async function getRolePermissionsClient(
  roleId: number | string
) {

  return apiClientFetch(
    `/v1/roles/${roleId}/permissions`,
    {}
  );
}
