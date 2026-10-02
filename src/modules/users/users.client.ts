// src/modules/users/users.client.ts

import { apiClientFetch } from '@/services/api.client';

import type {
  UsersResponse,
  UsersFilters,
  UpdateUserRoleData
} from './users.types';


// LIST
export async function listUsersClient(
  filters: UsersFilters = {}
): Promise<UsersResponse> {

  const query = new URLSearchParams(
    filters as any
  ).toString();

  return apiClientFetch(
    `/v1/users?${query}`
  );
}


// GET USER PERMISSIONS
export async function getUserPermissionsClient(
  userId: number | string
) {

  return apiClientFetch(
    `/v1/users/${userId}/permissions`,
    {}
  );
}


// SYNC USER PERMISSIONS
export async function assignUserPermissionsClient(
	userId: number | string,
	data: { permissions: string[] }
) {

  return apiClientFetch(
    `/v1/users/${userId}/permissions`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
}


// GET USER ROLE
export async function getUserRoleClient(
  userId: number | string
) {

  return apiClientFetch(
    `/v1/users/${userId}/role`,
    {}
  );
}


// ASSIGN USER ROLE
export async function assignUserRoleClient(
  userId: number | string,
  data: UpdateUserRoleData
) {

  return apiClientFetch(
    `/v1/users/${userId}/role`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}


// UPDATE USER ROLE
export async function updateUserRoleClient(
  userId: number | string,
  data: UpdateUserRoleData
) {

  return apiClientFetch(
    `/v1/users/${userId}/role`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
}
