// src/modules/permissions/permissions.types.ts

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  is_administrative: boolean;
  created_at: string;
  updated_at?: string;
}

export interface PermissionsFilters {
  page?: number;
  search?: string;
}

export interface PermissionsResponse {
  data: Permission[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

export interface PermissionResponse {
  success?: boolean;
  message?: string;
  data: any;
}
