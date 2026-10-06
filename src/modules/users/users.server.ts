// src/modules/users/users.server.ts

import { apiFetchServer } from '@/services/api.server';

import type {
  UsersResponse,
  UsersFilters,
  UpdateUserRoleData
} from './users.types';

import type { Site } from '@/lib/site';


// LIST
export async function listUsersServer(
  request: Request,
  filters: UsersFilters = {},
  site: Site
): Promise<UsersResponse> {

  const query = new URLSearchParams(
    filters as any
  ).toString();

  return apiFetchServer(
    `/v1/users?${query}`,
    {},
    request,
    site
  );
}


// GET USER PERMISSIONS
export async function getUserPermissionsServer(
  userId: number | string,
  request: Request,
  site: Site
) {

  return apiFetchServer(
    `/v1/users/${userId}/permissions`,
    {},
    request,
    site
  );
}


// INVITE USER
export async function inviteUserServer(
	data: { email?: string; role: string },
	request: Request,
	site: Site
) {

	return apiFetchServer(
		`/v1/invites`,
		{
			method: 'POST',
			body: JSON.stringify(data),
		},
		request,
		site
	);
}

// SYNC USER PERMISSIONS
export async function assignUserPermissionsServer(
	userId: number | string,
	data: { permissions: string[] },
	request: Request,
	site: Site
) {

	return apiFetchServer(
		`/v1/users/${userId}/permissions`,
		{
			method: 'PUT',
			body: JSON.stringify(data),
		},
		request,
		site
	);
}


// GET USER ROLE
export async function getUserRoleServer(
  userId: number | string,
  request: Request,
  site: Site
) {

  return apiFetchServer(
    `/v1/users/${userId}/role`,
    {},
    request,
    site
  );
}


// ASSIGN USER ROLE
export async function assignUserRoleServer(
  userId: number | string,
  data: UpdateUserRoleData,
  request: Request,
  site: Site
) {

  return apiFetchServer(
    `/v1/users/${userId}/role`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    request,
    site
  );
}


// UPDATE USER ROLE
export async function updateUserRoleServer(
  userId: number | string,
  data: UpdateUserRoleData,
  request: Request,
  site: Site
) {

  return apiFetchServer(
    `/v1/users/${userId}/role`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    request,
    site
  );
}
