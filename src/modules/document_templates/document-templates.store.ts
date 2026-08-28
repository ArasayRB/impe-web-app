// document-templates.store.ts

import type { DocumentTemplatesFilters } from './document-templates.types';
import { listDocumentTemplates, createDocumentTemplates, updateDocumentTemplates, deleteDocumentTemplates,
  activateDocumentTemplate as activateDocumentTemplateService,
  deactivateDocumentTemplate as deactivateDocumentTemplateService,
	getDocumentTemplateVariables as getDocumentTemplateVariablesService,
	generateDocumentTemplates as generateDocumentTemplatesService} from './document-templates.service';
import { createCrudModule } from '@/lib/createCrudModule';



function normalizeDocumentTemplatesResponse(apiResponse) {
	return {
		data: apiResponse.data.data,
		meta: {
			current_page: apiResponse.data.current_page,
			last_page: apiResponse.data.last_page,
			total: apiResponse.data.total,
		},
		error: apiResponse.error ?? null,
	};
}

export const documentTemplatesModule = createCrudModule({
  name: 'document-templates',
  fetcher:  (filters?: DocumentTemplatesFilters) =>
  listDocumentTemplates(
    import.meta.env.SSR ? (globalThis as any).__REQUEST__ : undefined,
    filters
  ),
  create: createDocumentTemplates,
  update: updateDocumentTemplates,
  remove: deleteDocumentTemplates,
  normalizer: normalizeDocumentTemplatesResponse,
});

export const activateDocumentTemplate =
  activateDocumentTemplateService;

export const deactivateDocumentTemplate =
  deactivateDocumentTemplateService;

export const getDocumentTemplateVariables =
  getDocumentTemplateVariablesService;

export const generateDocumentTemplates =
  generateDocumentTemplatesService;

export const fetchDocumentTemplates = documentTemplatesModule.fetch;
export const subscribeDocumentTemplates = documentTemplatesModule.subscribe;
export const hydrateDocumentTemplates = documentTemplatesModule.hydrate;
export const stateDocumentTemplates = documentTemplatesModule.getState;
