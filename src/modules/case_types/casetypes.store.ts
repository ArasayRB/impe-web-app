// /src/modules/case_types/casetypes.store.ts

import type { CaseTypes, CaseTypesFilters, CaseTypesResponse } from './casetypes.types';
import { listCaseTypes, createCaseTypes, updateCaseTypes, deleteCaseTypes } from './casetypes.service';
import { createCrudModule } from '@/lib/createCrudModule';
import {caseTypeDefinitionSchema} from "@/modules/case_types/definition.schema";



function normalizeCaseTypesResponse(apiResponse) {
	return {
		data: apiResponse.data.data,
		meta: {
			current_page: apiResponse.data.current_page,
			last_page: apiResponse.data.last_page,
			total: apiResponse.data.total,
		},
		error: null,
	};
}

export const casetypesModule = createCrudModule({
	name: 'casetypes',
	fetcher:  (filters?: CaseTypesFilters) =>
	listCaseTypes(
		import.meta.env.SSR ? (globalThis as any).__REQUEST__ : undefined,
		filters
	),
	search:  async (text: string, signal?: AbortSignal) =>{
		return listCaseTypes(

			import.meta.env.SSR
				? (globalThis as any).__REQUEST__
				: undefined,

			{

				search: text,
				per_page: 10,
				page: 1,

			},
			
			undefined,

    		signal

		);
	},
	create: createCaseTypes,
	update: updateCaseTypes,
	remove: deleteCaseTypes,
	tagSelector:{

			map(item){

				return{

					id:item.id,

					label:item.name,

        			data:item

				};

			},
			async create(text){

				const res = await createCaseTypes({

					name:text,
					active:1

				});

				return{

					id:res.data.id,
					label:res.data.name,
					data:res.data

				};

			}

	},
	definitionSchema: caseTypeDefinitionSchema,
	normalizer: normalizeCaseTypesResponse,
});

export const fetchCaseTypes = casetypesModule.fetch;
export const subscribeCaseTypes = casetypesModule.subscribe;
export const hydrateCaseTypes = casetypesModule.hydrate;
export const stateCaseTypes = casetypesModule.getState;
