// cases.service.ts

import type { CaseFilters } from './cases.types';
import { getSite } from '@/lib/site.store';
import type { Site } from '@/lib/site';


function ensureSite(site?: Site): Site {
  if (!site) {
    throw new Error('[Service] Site is required in SSR');
  }
  return site;
}

export async function listCases(
  request?: Request,
  filters: CaseFilters = {},
  site?: Site 
) {
  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();

  console.log('[SERVICE] site', resolvedSite);

  if (import.meta.env.SSR) {
    try {
      const { listCasesServer } = await import('./cases.server');
      return listCasesServer(request!, filters, resolvedSite);
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
    const { listCasesClient } = await import('./cases.client');
    return listCasesClient(filters);
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

export async function getCasesAnalytics(
  filters: Record<string, any> = {},
  request?: Request,
  site?: Site
) {
  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();
  if (import.meta.env.SSR) {
    const { getCasesAnalyticsServer } = await import('./cases.server');

    return getCasesAnalyticsServer(filters,request!,resolvedSite);
  }

  const { getCasesAnalyticsClient }= await import('./cases.client');

  return getCasesAnalyticsClient(filters);
}

// STORE
export async function createCase(
  data: any,
  request?: Request,
  site?: Site
) {
  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();

  if (import.meta.env.SSR) {
    const { createCaseServer } = await import('./cases.server');
    return createCaseServer(data, request!, resolvedSite);
  }

  const { createCaseClient } = await import('./cases.client');
  return createCaseClient(data);
}

// UPDATE
export async function updateCase(
  id: number | string,
  data: any,
  request?: Request,
  site?: Site
) {
  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();

  if (import.meta.env.SSR) {
    const { updateCaseServer } = await import('./cases.server');
    return updateCaseServer(id, data, request!, resolvedSite);
  }

  const { updateCaseClient } = await import('./cases.client');
  return updateCaseClient(id, data);
}

// DELETE
export async function deleteCase(
  id: number | string,
  request?: Request,
  site?: Site
) {
  const resolvedSite = import.meta.env.SSR
    ? ensureSite(site)
    : getSite();

  if (import.meta.env.SSR) {
    const { deleteCaseServer } = await import('./cases.server');
    return deleteCaseServer(id, request!, resolvedSite);
  }

  const { deleteCaseClient } = await import('./cases.client');
  return deleteCaseClient(id);
}

export async function getCaseDocuments(
	id: number | string,
	request?: Request,
	site?: Site
) {

	const resolvedSite = import.meta.env.SSR
		? ensureSite(site)
		: getSite();

	if (import.meta.env.SSR) {

		const {
			getCaseDocumentsServer
		} = await import('./cases.server');

		return getCaseDocumentsServer(
			id,
			request!,
			resolvedSite
		);
	}

	const {
		getCaseDocumentsClient
	} = await import('./cases.client');

	return getCaseDocumentsClient(id);
}

export async function getWorkflow(
	id: number | string,
	request?: Request,
	site?: Site
) {

	const resolvedSite = import.meta.env.SSR
		? ensureSite(site)
		: getSite();

	if (import.meta.env.SSR) {

		const {
			getCaseWorkflowServer
		} = await import('./cases.server');

		return getCaseWorkflowServer(
			id,
			request!,
			resolvedSite
		);
	}

	const {
		getCaseWorkflowClient
	} = await import('./cases.client');

	return getCaseWorkflowClient(id);
}

export async function uploadCaseDocument(
	id: number | string,
	data: FormData,
	request?: Request,
	site?: Site
) {

	const resolvedSite = import.meta.env.SSR
		? ensureSite(site)
		: getSite();

	if (import.meta.env.SSR) {

		const {
			uploadCaseDocumentServer
		} = await import('./cases.server');

		return uploadCaseDocumentServer(
			id,
			data,
			request!,
			resolvedSite
		);
	}

	const {
		uploadCaseDocumentClient
	} = await import('./cases.client');

	return uploadCaseDocumentClient(
		id,
		data
	);
}

export async function generateCaseDocument(
	id: number | string,
	data: {
		template_id: number;
		document_key: string;
	},
	request?: Request,
	site?: Site
) {

	const resolvedSite = import.meta.env.SSR
		? ensureSite(site)
		: getSite();

	if (import.meta.env.SSR) {

		const {
			generateCaseDocumentServer
		} = await import('./cases.server');

		return generateCaseDocumentServer(
			id,
			data,
			request!,
			resolvedSite
		);
	}

	const {
		generateCaseDocumentClient
	} = await import('./cases.client');

	return generateCaseDocumentClient(
		id,
		data
	);
}

// DELETE
export async function deleteCaseDocument(
	id: number | string,
	request?: Request,
	site?: Site
) {
	const resolvedSite = import.meta.env.SSR
		? ensureSite(site)
		: getSite();

	if (import.meta.env.SSR) {
		const { deleteCaseDocumentServer } = await import('./cases.server');
		return deleteCaseDocumentServer(id, request!, resolvedSite);
	}

	const { deleteCaseDocumentClient } = await import('./cases.client');
	return deleteCaseDocumentClient(id);
}
