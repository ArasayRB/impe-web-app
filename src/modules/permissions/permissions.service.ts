// src/modules/permissions/permissions.service.ts
import { getSite } from '@/lib/site.store';
import type { Site } from '@/lib/site';
import type {
  PermissionsFilters
} from './permissions.types';

function ensureSite(site?: Site): Site {

  if (!site) {
    throw new Error('[Service] Site is required in SSR');
  }

  return site;
}


// LIST
export async function listPermissions(
  request?: Request,
  filters: PermissionsFilters = {},
  site?: Site
) {

  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();


  if (import.meta.env.SSR) {

    try {

      const { listPermissionsServer } =
        await import('./permissions.server');

      return listPermissionsServer(
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
            message: 'Timeout fetching permissions',
            code: 'TIMEOUT'
          }
        };

      }

      throw e;
    }
  }


  try {

    const { listPermissionsClient } =
      await import('./permissions.client');

    return listPermissionsClient(filters);

  } catch (e: any) {

    if (e.code === 'TIMEOUT') {

      return {
        data: [],
        meta: {},
        error: {
          message: 'Timeout fetching permissions',
          code: 'TIMEOUT'
        }
      };

    }

    throw e;
  }
}


// GET PERMISSION
export async function getPermission(
  permissionId: number | string,
  request?: Request,
  site?: Site
) {

  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();


  if (import.meta.env.SSR) {

    const { getPermissionServer } =
      await import('./permissions.server');

    return getPermissionServer(
      permissionId,
      request!,
      resolvedSite
    );
  }


  const { getPermissionClient } =
    await import('./permissions.client');

  return getPermissionClient(permissionId);
}
