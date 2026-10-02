// src/modules/roles/roles.service.ts
import { getSite } from '@/lib/site.store';
import type { Site } from '@/lib/site';
import type {
  RolesFilters
} from './roles.types';

function ensureSite(site?: Site): Site {

  if (!site) {
    throw new Error('[Service] Site is required in SSR');
  }

  return site;
}


// LIST
export async function listRoles(
  request?: Request,
  filters: RolesFilters = {},
  site?: Site
) {

  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();


  if (import.meta.env.SSR) {

    try {

      const { listRolesServer } =
        await import('./roles.server');

      return listRolesServer(
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

    const { listRolesClient } =
      await import('./roles.client');

    return listRolesClient(filters);

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


// GET ROLE
export async function getRole(
  roleId: number | string,
  request?: Request,
  site?: Site
) {

  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();


  if (import.meta.env.SSR) {

    const { getRoleServer } =
      await import('./roles.server');

    return getRoleServer(
      roleId,
      request!,
      resolvedSite
    );
  }


  const { getRoleClient } =
    await import('./roles.client');

  return getRoleClient(roleId);
}



// GET ROLE PERMISSIONS
export async function getRolePermissions(
	roleId: number | string,
	request?: Request,
	site?: Site
) {

  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();


  if (import.meta.env.SSR) {

    const { getRolePermissionsServer } =
      await import('./roles.server');

    return getRolePermissionsServer(
      roleId,
      request!,
      resolvedSite
    );
  }


  const { getRolePermissionsClient } =
    await import('./roles.client');

  return getRolePermissionsClient(roleId);
}
