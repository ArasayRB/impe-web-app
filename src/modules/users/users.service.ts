// src/modules/users/users.service.ts

import type {
  UsersFilters,
  UpdateUserRoleData
} from './users.types';

import { getSite } from '@/lib/site.store';
import type { Site } from '@/lib/site';


function ensureSite(site?: Site): Site {

  if (!site) {
    throw new Error('[Service] Site is required in SSR');
  }

  return site;
}


// LIST
export async function listUsers(
  request?: Request,
  filters: UsersFilters = {},
  site?: Site
) {

  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();


  if (import.meta.env.SSR) {

    try {

      const { listUsersServer } =
        await import('./users.server');

      return listUsersServer(
        request!,
        filters,
        resolvedSite
      );

    } catch (e: any) {

      if (e.code === 'TIMEOUT') {

        return {
          data: [],
          meta: {},
          error: {
            message: 'Timeout fetching users',
            code: 'TIMEOUT'
          }
        };

      }

      throw e;
    }
  }


  try {

    const { listUsersClient } =
      await import('./users.client');

    return listUsersClient(filters);

  } catch (e: any) {

    if (e.code === 'TIMEOUT') {

      return {
        data: [],
        meta: {},
        error: {
          message: 'Timeout fetching users',
          code: 'TIMEOUT'
        }
      };

    }

    throw e;
  }
}


// GET PERMISSIONS
export async function getUserPermissions(
	userId: number | string,
	request?: Request,
	site?: Site
) {

  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();


  if (import.meta.env.SSR) {

    const { getUserPermissionsServer } =
      await import('./users.server');

    return getUserPermissionsServer(
      userId,
      request!,
      resolvedSite
    );
  }


  const { getUserPermissionsClient } =
    await import('./users.client');

  return getUserPermissionsClient(userId);
}


// ASSIGN PERMISSIONS
export async function assignUserPermissions(
	userId: number | string,
	data: { permissions: string[] },
	request?: Request,
	site?: Site
) {

	const resolvedSite = import.meta.env.SSR
		? ensureSite(site)
		: getSite();

  if (import.meta.env.SSR) {

    const { assignUserPermissionsServer } =
      await import('./users.server');

    return assignUserPermissionsServer(
      userId,
      data,
      request!,
      resolvedSite
    );
  }


  const { assignUserPermissionsClient } =
    await import('./users.client');

  return assignUserPermissionsClient(
    userId,
    data
  );
}

// Invite User
export async function inviteUser(
	data: { email?: string; role: string },
	request?: Request,
	site?: Site
) {

  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();


  if (import.meta.env.SSR) {

    const { inviteUserServer } =
      await import('./users.server');

    return inviteUserServer(
      data,
      request!,
      resolvedSite
    );
  }


  const { inviteUserClient } =
    await import('./users.client');

  return inviteUserClient(data);
}

// GET ROLE
export async function getUserRole(
  userId: number | string,
  request?: Request,
  site?: Site
) {

  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();


  if (import.meta.env.SSR) {

    const { getUserRoleServer } =
      await import('./users.server');

    return getUserRoleServer(
      userId,
      request!,
      resolvedSite
    );
  }


  const { getUserRoleClient } =
    await import('./users.client');

  return getUserRoleClient(userId);
}


// ASSIGN ROLE
export async function assignUserRole(
  userId: number | string,
  data: UpdateUserRoleData,
  request?: Request,
  site?: Site
) {

  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();


  if (import.meta.env.SSR) {

    const { assignUserRoleServer } =
      await import('./users.server');

    return assignUserRoleServer(
      userId,
      data,
      request!,
      resolvedSite
    );
  }


  const { assignUserRoleClient } =
    await import('./users.client');

  return assignUserRoleClient(
    userId,
    data
  );
}


// UPDATE ROLE
export async function updateUserRole(
  userId: number | string,
  data: UpdateUserRoleData,
  request?: Request,
  site?: Site
) {

  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();


  if (import.meta.env.SSR) {

    const { updateUserRoleServer } =
      await import('./users.server');

    return updateUserRoleServer(
      userId,
      data,
      request!,
      resolvedSite
    );
  }


  const { updateUserRoleClient } =
    await import('./users.client');

  return updateUserRoleClient(
    userId,
    data
  );
}
