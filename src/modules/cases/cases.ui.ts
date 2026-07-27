import { casesModule } from './cases.store';
import { customersModule } from '@/modules/customers/customers.store';
import { casetypesModule } from '@/modules/case_types/casetypes.store';
import { resolveCrudFields } from "@/lib/resolveCrudFields";
import { mountCrudForm } from '@/lib/createCrudForm';
import { renderStatusPill } from '@/lib/ui.helpers';
import { mountCrud } from '@/lib/createCrudUi';
import { modalController } from '@/lib/modal.controller';
import type { Field } from '@/lib/createCrudForm';
import { caseFields } from './cases.form.config';
import { initSite } from '@/lib/site.store';
import { mountAutocomplete } from '@/lib/ui.autocomplete';
import { registerModal } from '@/lib/modal.registry';
import { searchCustomers } from '@/modules/customers/customers.service';
import { openAddCustomerForm } from '@/modules/customers/customers.ui';
import { on } from '@/lib/event.bus';
import { debounce } from '@/lib/debounce';
import { t } from '@/lib/i18n/i18n';

const fields: Field[] =  resolveCrudFields(caseFields, {

    customers: customersModule,
    caseTypes: casetypesModule

});

const customerField = fields.find(

    x=>x.name==="customer_id"

)!;

const caseTypeField = fields.find(

    x=>x.name==="case_type_id"

);

let currentFilters: Record<string, any> = {};



function mountCaseSearch() {
  const form = document.querySelector('[data-form="case-search"]');
  if (!form) return;

   // Avoid duplicates
  if ((form as any)._mounted) return;
  (form as any)._mounted = true;

  const input = form.querySelector('[data-input]') as HTMLInputElement;
  if (!input) return;

  // init from url
  const params = new URLSearchParams(window.location.search);
  const initialSearch = params.get('search');

  if (initialSearch) {
    input.value = initialSearch;
    currentFilters.search = initialSearch;

    casesModule.fetch(currentFilters);
  }

  const search = debounce(async (q: string) => {console.log('searching: '+q)
    // updtae filters
    if (!q) {
      delete currentFilters.search;
    } else {
      currentFilters.search = q;
    }

    //// URL
    const params = new URLSearchParams(window.location.search);console.log('params: ',params)

    if (q) {
      params.set('search', q);
    } else {
      params.delete('search');
    }console.log('params2: ',params,'currentFilters',currentFilters)

    window.history.replaceState({}, '', `?${params}`);

    // fetch
    try {
      await casesModule.fetch(currentFilters);
    } catch (e) {
      console.error('search error', e);
    }
  }, 300);

  input.addEventListener('input', (e) => {
    const value = (e.target as HTMLInputElement).value;
    search(value);
  });
}

function transformCasePayload(payload){

    return{

        ...payload,

        case_type_id:

            payload.case_type_id?.[0]?.id

            ?? null,

        customer_id:

            payload.customer_id?.[0]?.id

            ?? null

    };

}

function openEditForm(row: any) {
  const modal = document.getElementById('edit-case-modal');
  if (!modal) return;

	const container = modal.querySelector('[data-form-container]');
	if (!container) return;console.log('Row to edit',row);
console.log('row',row);
  const formRow = {

    ...row,
    customer_id:
        row.customer_id
        ? [
            {
                id: row.customer_id,
                label: row.customer.name
            }
        ]
        : [],

    case_type_id:

        row.case_type_id

        ? [

            {

                id:row.case_type_id,

                label:row.type.name,

                data:
                    row.type

            }

        ]

        : [],
    // Mantener explícitamente
    // el status original del case
    status:
      row.status ?? null

  };
  console.log('form row',formRow);
  mountCrudForm({
    el: container,
    module: casesModule,
    mode: 'edit',
    fields,
    modalId: 'edit-case-modal',
    translations:'cases',
    getData: () => formRow,
    transform:transformCasePayload
  });
  modalController.setHtmlText('edit-case-modal','data-from="case"', t('cases.buttons.create_customer'));
	modalController.setHtmlText('edit-case-modal','data-modal-title', t('cases.buttons.edit'));
  modalController.open('edit-case-modal');
}

function openRemoveForm(row: any) {
  const container = document.getElementById('delete-case-modal');
  if (!container) return;

  console.log('case row to remove',row)
  //await casesModule.deleteItem(id);
  let htmlContent = `<svg
						class="w-16 h-16 mx-auto text-red-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg
					>
					<h3 class="mt-5 mb-6 text-lg text-gray-500 dark:text-gray-400">
						${t('common.messages.shure_remove')}: ${row.case_number}?
					</h3>
					<a
						href="#"
            data-remove="yes"
            data-id="${row.id}"
						class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2 dark:focus:ring-red-800"
					>
						Yes, I'm sure
					</a>
					<a
						href="#"
						data-close-modal="delete-case-modal"
            data-remove="no"
						class="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
						{/*data-modal-toggle="delete-case-modal"*/}
					>
						No, cancel
					</a>`; 
  modalController.setContent('delete-case-modal',htmlContent);
  modalController.open('delete-case-modal');
}


export function openAddForm(id:string) {
  const root = document.getElementById('cases-root');

  if (root?.dataset.site) {
    initSite(JSON.parse(root.dataset.site));
  }
  const container = document.getElementById(id)?.querySelector('[data-form-container]');
  if (!container) return;

  mountCrudForm({
    el: container,
    module: casesModule,
    mode: 'create',
    fields,
    modalId: id,
    translations:'cases',
    onSuccess: async(res) => {
      await casesModule.fetch(currentFilters);
    },
    transform: transformCasePayload,
  });
  modalController.setHtmlText(id,'data-from="case"', t('cases.buttons.create_customer'));
  modalController.setHtmlText(id,'data-modal-title', t('cases.buttons.add'));
  modalController.open(id);
}

export async function mountCases(el: HTMLElement) {
  
  const root = document.getElementById('cases-root');

  if (root?.dataset.site) {
    initSite(JSON.parse(root.dataset.site));
  }

  const columnsData = [
      { key: 'case_number', label: 'cases.columns.no_case' },
      { key: 'title', label: 'cases.columns.case' },
      { key: 'customers.name', label: 'cases.columns.customer' },
      { key: 'customers.email', label: 'cases.columns.email' },
      { key: 'email_case', label: 'cases.columns.case_email' },
      {
        key: 'status',
        label: 'cases.columns.status',
        render: (value) => renderStatusPill(value,t),
      },
    ];

  await mountCrud({
    el,
    module: casesModule,
    columns: columnsData,
    translations:'cases',

    
		export: {
			filename: 'cases',

			columns: columnsData
		},

		actions: {
			edit: true,
			delete: false,
  		info: true,
		},

  	getFilters: () => currentFilters,
		
		// 👇 AQUÍ conectamos EDIT
    onEdit: (row) => {
      openEditForm(row);
    },

    // 👇 DELETE modal show
    onDelete: async (row) => {
      openRemoveForm(row);
    },

    // 👇 DELETE fetch
    onRemove: async (id) => {
      await casesModule.deleteItem(id);
      
      await casesModule.fetch(currentFilters);
    },
		onInfo: () => {
			window.location.href =
				'/dashboard/analytics/cases';
		},
  });

  mountCaseSearch();
}
registerModal('add-case-modal', openAddForm);
registerModal('edit-case-modal', openEditForm);
registerModal('add-customer-modal', openAddCustomerForm);

on('case:created', async () => {
  await casesModule.fetch();
});
