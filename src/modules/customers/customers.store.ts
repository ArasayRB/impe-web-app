// customers.store.ts

import type { Customer, CustomerFilters, CustomerResponse } from './customers.types';
import { listCustomers, createCustomer, updateCustomer, deleteCustomer, bulkCustomers, bulkDeleteCustomers } from './customers.service';
import { createCrudModule } from '@/lib/createCrudModule';
import { openAddCustomerForm } from '@/modules/customers/customers.ui';



function normalizeCustomersResponse(apiResponse) {
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

export const customersModule = createCrudModule({
	name: 'customers',
	fetcher:  (filters?: CustomerFilters) =>
	listCustomers(
		import.meta.env.SSR ? (globalThis as any).__REQUEST__ : undefined,
		filters
	),
	
	search:  async (text: string, signal?: AbortSignal) =>{
		return listCustomers(

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
  create: createCustomer,
  import: bulkCustomers,
  bulk_remove: bulkDeleteCustomers,
  update: updateCustomer,
  remove: deleteCustomer,
  tagSelector:{

		map(item){

			return{

				id:item.id,

				label:item.name

			};

		},

		async create(text){

			return new Promise(resolve=>{

				openAddCustomerForm(

					"add-customer-modal",

					{

						from:"case",
						initialName:text,
						resolve

					}

				);

			});

		}


  },
  normalizer: normalizeCustomersResponse,
});

export const fetchCustomers = customersModule.fetch;
export const subscribeCustomers = customersModule.subscribe;
export const hydrateCustomers = customersModule.hydrate;
export const stateCustomers = customersModule.getState;
