// document-templates.service.ts

import type { DocumentTemplatesFilters, DocumentTemplateVariableGroup } from './document-templates.types';
import { getSite } from '@/lib/site.store';
import type { Site } from '@/lib/site';


function ensureSite(site?: Site): Site {
  if (!site) {
    throw new Error('[Service] Site is required in SSR');
  }
  return site;
}

export async function listDocumentTemplates(
  request?: Request,
  filters: DocumentTemplatesFilters = {},
  site?: Site 
) {
  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();

  console.log('[SERVICE] site', resolvedSite);

  if (import.meta.env.SSR) {
    try {
      const { listDocumentTemplatesServer } = await import('./document-templates.server');
      return listDocumentTemplatesServer(request!, filters, resolvedSite);
    } catch (e:any) {
      if (e.code === 'TIMEOUT') {
        return {
          data: [],
          meta: {},
          error: {
            message: 'Timeout fetching cases',
            code: 'TIMEOUT'
          }
        };
      }

      throw e; // errors reals go on
    }
  }

  try {
    const { listDocumentTemplatesClient } = await import('./document-templates.client');
    return listDocumentTemplatesClient(filters);
  } catch (e:any) {
    if (e.code === 'TIMEOUT') {
        return {
          data: [],
          meta: {},
          error: {
            message: 'Timeout fetching cases',
            code: 'TIMEOUT'
          }
        };
      }

      throw e; // errors reals go on
  }
}

// STORE
export async function createDocumentTemplates(
  data: FormData,
  request?: Request,
  site?: Site
) {
  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();

  if (import.meta.env.SSR) {
    const { createDocumentTemplatesServer } = await import('./document-templates.server');
    return createDocumentTemplatesServer(data, request!, resolvedSite);
  }

  const { createDocumentTemplatesClient } = await import('./document-templates.client');
  return createDocumentTemplatesClient(data);
}

// Generate from template
export async function generateDocumentTemplates(
  id: number | string,
  data: any,
  request?: Request,
  site?: Site
) {
  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();

  if (import.meta.env.SSR) {
    const { generateDocumentTemplatesServer } = await import('./document-templates.server');
    return generateDocumentTemplatesServer(id,data, request!, resolvedSite);
  }

  const { generateDocumentTemplatesClient } = await import('./document-templates.client');
  return generateDocumentTemplatesClient(id,data);
}

export async function getDocumentTemplateVariables(): Promise<DocumentTemplateVariableGroup[]> {
  const response = import.meta.env.SSR
    ? await (await import('./document-templates.server'))
        .getDocumentTemplateVariablesServer()
    : await (await import('./document-templates.client'))
        .getDocumentTemplateVariablesClient();

  return Object.values(
    response.data
  ).map(group => ({
    ...group,

    variables: Array.isArray(group.variables)
      ? group.variables
      : Object.values(group.variables),
  }));
}

// UPDATE
export async function updateDocumentTemplates(
  id: number | string,
  data: any,
  request?: Request,
  site?: Site
) {
  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();

  if (import.meta.env.SSR) {
    const { updateDocumentTemplatesServer } = await import('./document-templates.server');
    return updateDocumentTemplatesServer(id, data, request!, resolvedSite);
  }

  const { updateDocumentTemplatesClient } = await import('./document-templates.client');
  return updateDocumentTemplatesClient(id, data);
}

export async function activateDocumentTemplate(
  id: number | string,
  request?: Request,
  site?: Site
) {
  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();

  if (import.meta.env.SSR) {
    const { activateDocumentTemplatesServer } =
      await import('./document-templates.server');

    return activateDocumentTemplatesServer(
      id,
      request!,
      resolvedSite
    );
  }

  const { activateDocumentTemplatesClient } =
    await import('./document-templates.client');

  return activateDocumentTemplatesClient(id);
}

export async function deactivateDocumentTemplate(
  id: number | string,
  request?: Request,
  site?: Site
) {
  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();

  if (import.meta.env.SSR) {
    const { deactivateDocumentTemplatesServer } =
      await import('./document-templates.server');

    return deactivateDocumentTemplatesServer(
      id,
      request!,
      resolvedSite
    );
  }

  const { deactivateDocumentTemplatesClient } =
    await import('./document-templates.client');

  return deactivateDocumentTemplatesClient(id);
}

// DELETE
export async function deleteDocumentTemplates(
  id: number | string,
  request?: Request,
  site?: Site
) {
  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();

  if (import.meta.env.SSR) {
    const { deleteDocumentTemplatesServer } = await import('./document-templates.server');
    return deleteDocumentTemplatesServer(id, request!, resolvedSite);
  }

  const { deleteDocumentTemplatesClient } = await import('./document-templates.client');
  return deleteDocumentTemplatesClient(id);
}
