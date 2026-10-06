// src/modules/users/users.store.ts

import type { UsersFilters } from './users.types';

import {
  listUsers,
  getUserPermissions as getUserPermissionsService,
	assignUserPermissions as assignUserPermissionsService,
  getUserRole as getUserRoleService,
  assignUserRole as assignUserRoleService,
  updateUserRole as updateUserRoleService,
  inviteUser as inviteUserService
} from './users.service';

import { createCrudModule } from '@/lib/createCrudModule';


function normalizeUsersResponse(
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


export const usersModule = createCrudModule({

  name: 'users',

  fetcher: (filters?: UsersFilters) =>
    listUsers(
      import.meta.env.SSR
        ? (globalThis as any).__REQUEST__
        : undefined,

      filters
    ),

  create: (data) =>
    inviteUserService(
      data
	),

  normalizer:
    normalizeUsersResponse,

});

export const getUserPermissions =
  getUserPermissionsService;

export const assignUserPermissions =
  assignUserPermissionsService;

export const getUserRole =
  getUserRoleService;

export const assignUserRole =
  assignUserRoleService;

export const inviteUser =
  inviteUserService;

export const updateUserRole =
  updateUserRoleService;


export const fetchUsers =
  usersModule.fetch;

export const subscribeUsers =
  usersModule.subscribe;

export const hydrateUsers =
  usersModule.hydrate;

export const stateUsers =
  usersModule.getState;
