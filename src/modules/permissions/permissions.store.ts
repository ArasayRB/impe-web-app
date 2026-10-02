// src/modules/permissions/permissions.store.ts

import type { PermissionsFilters, RolesFilters } from './permissions.types';

import {
  getPermission as getPermissionService,
	listPermissions
} from './permissions.service';

import { createCrudModule } from '@/lib/createCrudModule';


function normalizePermissionsResponse(
  apiResponse: any
) {

  return {
    data: apiResponse.data.data,

    meta: {
      current_page:
        apiResponse.data.current_page,

      last_page:
        apiResponse.data.last_page,

      total:
        apiResponse.data.total,
    },

    error:
      apiResponse.error ?? null,
  };
}


export const permissionsModule = createCrudModule({

  name: 'permissions',

  fetcher: (filters?: PermissionsFilters) =>
    listPermissions(
      import.meta.env.SSR
        ? (globalThis as any).__REQUEST__
        : undefined,

      filters
    ),

  normalizer:
    normalizePermissionsResponse,

});


export const getPermission =
  getPermissionService;


export const fetchPermissions =
  permissionsModule.fetch;

export const subscribePermissions =
  permissionsModule.subscribe;

export const hydratePermissions =
  permissionsModule.hydrate;

export const statePermissions =
  permissionsModule.getState;
