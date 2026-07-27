// customers.types.ts

export interface Customer {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface CustomerFilters {
  page?: number;
  search?: string;
  deviceHash?: string;
}

export interface CustomerResponse {
  data: Customer[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}
