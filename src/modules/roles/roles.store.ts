// src/modules/roles/roles.store.ts

import type { RolesFilters } from './roles.types';

import {
  listRoles,
  getRole as getRoleService
} from './roles.service';

import { createCrudModule } from '@/lib/createCrudModule';


function normalizeRolesResponse(
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


export const rolesModule = createCrudModule({

  name: 'roles',

  fetcher: (filters?: RolesFilters) =>
    listRoles(
      import.meta.env.SSR
        ? (globalThis as any).__REQUEST__
        : undefined,

      filters
    ),

  normalizer:
    normalizeRolesResponse,

});


export const getRole =
  getRoleService;


export const fetchRoles =
  rolesModule.fetch;

export const subscribeRoles =
  rolesModule.subscribe;

export const hydrateRoles =
  rolesModule.hydrate;

export const stateRoles =
  rolesModule.getState;
