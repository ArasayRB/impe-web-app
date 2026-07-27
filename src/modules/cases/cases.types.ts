// cases.types.ts

export interface Case {
  id: number;
  title: string;
  status: string;
  created_at: string;
}

export interface CaseFilters {
  page?: number;
  search?: string;
  deviceHash?: string;
}

export interface CaseResponse {
  data: Case[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}
