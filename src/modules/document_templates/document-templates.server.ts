// document-templates.server.ts

import { apiFetchServer } from '@/services/api.server';
import type { DocumentTemplatesResponse, DocumentTemplatesFilters } from './document-templates.types';
import type { Site } from '@/lib/site';

export async function listDocumentTemplatesServer(
  request: Request,
  filters: DocumentTemplatesFilters = {},
  site : Site
): Promise<DocumentTemplatesResponse> {
  const query = new URLSearchParams(filters as any).toString();

  return apiFetchServer(`/v1/document-templates?${query}`, {}, request, site);
}

// Store
export async function createDocumentTemplatesServer(
  data: FormData,
  request: Request,
  site: Site
) {
  return apiFetchServer(
    `/v1/document-templates`,
    {
      method: 'POST',
      body: data,
    },
    request,
    site
  );
}

//Generate from template
export async function generateDocumentTemplatesServer(
  id: number | string,
  data: any,
  request: Request,
  site: Site
) {
  return apiFetchServer(
    `/v1/document-templates/${id}`,
    {
      method: 'POST',
      body: data,
    },
    request,
    site
  );
}

//getVariables
export async function getDocumentTemplateVariablesServer() {
  return apiFetchServer(
    `/v1/document-templates/variables`
  );
}

// UPDATE
export async function updateDocumentTemplatesServer(
  id: number | string,
  data: any,
  request: Request,
  site: Site
) {
  return apiFetchServer(
    `/v1/document-templates/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    request,
    site
  );
}

// Deactivate
export async function deactivateDocumentTemplatesServer(
  id: number | string,
  request: Request,
  site: Site
) {
  return apiFetchServer(
    `/v1/document-templates/${id}/deactivate`,
    {
      method: 'PATCH'
		},
    request,
    site
  );
}

// Activate
export async function activateDocumentTemplatesServer(
  id: number | string,
  request: Request,
  site: Site
) {
  return apiFetchServer(
    `/v1/document-templates/${id}/activate`,
    {
      method: 'PATCH'
		},
    request,
    site
  );
}

// Get
export async function getDocumentTemplatesServer(
  id: number | string,
  request: Request,
  site: Site
) {
  return apiFetchServer(
    `/v1/document-templates/${id}`,
    {},
    request,
    site
  );
}

// DELETE
export async function deleteDocumentTemplatesServer(
  id: number | string,
  request: Request,
  site: Site
) {
  return apiFetchServer(
    `/v1/document-templates/${id}`,
    {
      method: 'DELETE',
    },
    request,
    site
  );
}
