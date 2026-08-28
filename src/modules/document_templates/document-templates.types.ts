// document_templates.types.ts

export interface DocumentTemplateVariable {
  key: string;
  label: string;
  resolver: string;
  type: string;
}

export interface DocumentTemplateVariableGroup {
  group: string;
  key: string;
  variables: DocumentTemplateVariable[];
}

export interface DocumentTemplateVariablesResponse {
  success: boolean;
  message: string;
  data: DocumentTemplateVariableGroup[];
}

export interface DocumentTemplate {
  id: number;
  business_id: number;
  name: string;
  slug: string;
  description: string | null;
  engine: 'docx' | 'html';
  template_path: string;
  original_name: string;
  mime: string;
  size: number;
  active: boolean;
  metadata: Record<string, any> | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentTemplatesFilters {
  page?: number;
  search?: string;
}

export interface DocumentTemplatesResponse {
  data: DocumentTemplate[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}
