// src/modules/users/users.types.ts

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface UsersFilters {
  page?: number;
  search?: string;
}

export interface UsersResponse {
  data: User[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

export interface UserRoleResponse {
  success?: boolean;
  message?: string;
  data: any;
}

export interface UpdateUserRoleData {
  role: string;
}
