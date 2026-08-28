// document-templates.client.ts

import { apiClientFetch } from '@/services/api.client';
import type { DocumentTemplatesResponse, DocumentTemplatesFilters } from './document-templates.types';

export async function listDocumentTemplatesClient(
  filters: DocumentTemplatesFilters = {}
): Promise<DocumentTemplatesResponse> {
  const query = new URLSearchParams(filters as any).toString();

  return apiClientFetch(`/v1/document-templates?${query}`);
}

export async function createDocumentTemplatesClient(
  data: FormData
){
  return apiClientFetch(`/v1/document-templates`, {
    method: 'POST',
    body: data,
  });
}

export async function generateDocumentTemplatesClient(
	id: number | string,
  data: any
){
  return apiClientFetch(`/v1/document-templates/${id}/generate`, {
    method: 'POST',
    body: data,
  });
}

export async function getDocumentTemplateVariablesClient() {
  return apiClientFetch(
    `/v1/document-templates/variables`
  );
}

// UPDATE
export async function updateDocumentTemplatesClient(
  id: number | string,
  data: any
) {
  return apiClientFetch(`/v1/document-templates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Deactivate
export async function deactivateDocumentTemplatesClient(
  id: number | string
) {
  return apiClientFetch(`/v1/document-templates/${id}/deactivate`, {
    method: 'PATCH',
  });
}

// Activate
export async function activateDocumentTemplatesClient(
  id: number | string
) {
  return apiClientFetch(`/v1/document-templates/${id}/activate`, {
    method: 'PATCH',
  });
}

// GET
export async function getDocumentTemplatesClient(
  id: number | string
) {
  return apiClientFetch(`/v1/document-templates/${id}`, {});
}

// DELETE
export async function deleteDocumentTemplatesClient(id: number | string) {
  return apiClientFetch(`/v1/document-templates/${id}`, {
    method: 'DELETE',
  });
}
