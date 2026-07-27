// CaseTypes.types.ts

export interface CaseTypes {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface CaseTypesFilters {
  page?: number;
  search?: string;
  deviceHash?: string;
}

export interface CaseTypesResponse {
  data: CaseTypes[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}
