// cases.store.ts

import type { Case, CaseFilters, CaseResponse } from './cases.types';
import { listCases, createCase, updateCase, deleteCase,
	getCaseDocuments as getCaseDocumentsService,
	uploadCaseDocument as uploadCaseDocumentService,
	generateCaseDocument as generateCaseDocumentService,
	deleteCaseDocument as deleteCaseDocumentService
 } from './cases.service';
import { createCrudModule } from '@/lib/createCrudModule';



function normalizeCasesResponse(apiResponse) {
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

export const casesModule = createCrudModule({
  name: 'cases',
  fetcher:  (filters?: CaseFilters) =>
  listCases(
    import.meta.env.SSR ? (globalThis as any).__REQUEST__ : undefined,
    filters
  ),
  create: createCase,
  update: updateCase,
  remove: deleteCase,
  normalizer: normalizeCasesResponse,
});

export const getCaseDocuments =
	getCaseDocumentsService;

export const uploadCaseDocument =
	uploadCaseDocumentService;

export const generateCaseDocument =
	generateCaseDocumentService;

export const deleteCaseDocument =
	deleteCaseDocumentService;

export const fetchCases = casesModule.fetch;
export const subscribeCases = casesModule.subscribe;
export const hydrateCases = casesModule.hydrate;
export const stateCases = casesModule.getState;
