// src/modules/roles/roles.types.ts

export interface Role {
  id: number;
  name: string;
  created_at: string;
  updated_at?: string;
}

export interface RolesFilters {
  page?: number;
  search?: string;
}

export interface RolesResponse {
  data: Role[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

export interface RoleResponse {
  success?: boolean;
  message?: string;
  data: any;
}
