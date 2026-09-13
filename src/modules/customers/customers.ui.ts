import { customersModule } from './customers.store';
import { mountCrudForm } from '@/lib/createCrudForm';
import { mountCrud } from '@/lib/createCrudUi';
import { confirmAction } from '@/lib/confirmAction';
import { initSite } from '@/lib/site.store';
import { modalController } from '@/lib/modal.controller';
import { registerModal } from '@/lib/modal.registry';
import type { Field } from '@/lib/createCrudForm';
import { customerFields } from './customers.form.config';
import { customerColumns } from './customers.columns.config';
import { emit } from '@/lib/event.bus';
import { t } from '@/lib/i18n/i18n';
import { resolveTranslation } from '@/lib/i18n/resolveTranslations';
import { on } from '@/lib/event.bus';
import { debounce } from '@/lib/debounce';
import {showSuccess,showError} from '@/lib/toast';


const fields: Field[] = customerFields;
let selectedCustomerId: string | number | null = null;
let autocompleteInstance: any = null;
let currentFilters: Record<string, any> = {};

function mountCustomerSearch() {
	const form = document.querySelector('[data-form="customer-search"]');
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

		customersModule.fetch(currentFilters);
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
			await customersModule.fetch(currentFilters);
		} catch (e) {
			console.error('search error', e);
		}
	}, 300);

	input.addEventListener('input', (e) => {
		const value = (e.target as HTMLInputElement).value;
		search(value);
	});
}

function formatDateInput(
    value: string | null | undefined
): string {

    if (!value) {
        return "";
    }

    return value.slice(0, 10);
}

function openEditForm(row: any) {
	const modal = document.getElementById('edit-customer-modal');
	if (!modal) return;

	const container = modal.querySelector('[data-form-container]');
	if (!container) return;console.log('Row to edit',row);

	const formRow = {

    ...row,
    birthdate:
        formatDateInput(row.birthdate),

  };
	mountCrudForm({
		el: container,
		module: customersModule,
		mode: 'edit',
		fields,
		modalId: 'edit-customer-modal',
		translations:'customers',
		getData: () => formRow,
	});
	modalController.setHtmlText('edit-customer-modal','data-modal-title', t('customers.buttons.edit'));
	modalController.open('edit-customer-modal');
}

function openRemoveForm(row: any) {
	let svgString = `<svg
						class="w-16 h-16 mx-auto text-red-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
	confirmAction({
		modalId: 'delete-customers-modal',
		svg:svgString,
		title:`${t('common.messages.remove')}`,
		message:`${t('common.messages.shure_remove')}: ${row.name}`,
		onConfirm: async () => {
			await customersModule.deleteItem(row.id);

			await customersModule.fetch();
		},
		successMessage:t('common.messages.deleted'),
		errorMessage:t('common.errors.UNKNOWN')
	});
	/*const container = document.getElementById('delete-customers-modal');
	if (!container) return;

	console.log('customer row to remove',row)
	//await customersModule.deleteItem(id);
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
						${t('common.messages.shure_remove')}: ${row.name}?
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
						data-close-modal="delete-customers-modal"
						data-remove="no"
						class="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
						
					>
						No, cancel
					</a>`; 
	modalController.setContent('delete-customers-modal',htmlContent);
	modalController.open('delete-customers-modal');*/
}

export function openAddCustomerForm(id: string, context?: any) {console.log('context for add customer form',context)
  const container = document
    .getElementById(id)
    ?.querySelector('[data-form-container]');

  if (!container) return;

	const resolvedFields = resolveTranslation(fields);

  mountCrudForm({
    el: container,
    module: customersModule,
    mode: 'create',
    fields: resolvedFields,
    modalId: id,
    translations:'customers',
	getData: () => ({

		name: context?.initialName ?? ""

	}),
    onSuccess: async (res) => {
      if (!res?.data) return;
      

      if (context?.resolve) {

			context.resolve({

				id:res.data.id,

				label:res.data.name

			});

		}else{
				await customersModule.fetch(currentFilters);
			}
    },
  });

  modalController.setHtmlText('add-customer-modal','data-modal-title', t('customers.buttons.add'));
  modalController.open(id,context);
}

export async function mountCustomers(el: HTMLElement) {
	
	const root = document.getElementById('customers-root');

	if (root?.dataset.site) {
		initSite(JSON.parse(root.dataset.site));
	}

	await mountCrud({
		el,
		module: customersModule,
		columns: customerColumns,
		translations:'customers',

		actions: {
			edit: true,
			delete: true,
			import: true,
  		info: true,
			bulk_delete:true
		},
		export: {
			filename: 'customers',

			columns: customerColumns
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
			await customersModule.deleteItem(id);
			
			await customersModule.fetch(currentFilters);
		},

		onRemoveSuccess: async () => {
			await customersModule.fetch();
			showSuccess(t('common.messages.deleted'));
		},

		onRemoveError: () => {
			showError(t('common.messages.delete_error'));
		},
		onImport: async (rows) => {
			await customersModule.bulkImport(rows);

			await customersModule.fetch();

			showSuccess(
				t('common.messages.imported')
			);
		},
		onInfo: () => {
			window.location.href =
				'/dashboard/analytics/customers';
		},
		onBulkDelete: async (
			ids
		) => {

			await customersModule.bulkRemove(
				ids
			);

			await customersModule.fetch();

			showSuccess(
				t(
				'common.messages.deleted'
				)
			);
		}
	});

	mountCustomerSearch();
}

// Register
registerModal('add-customer-modal', openAddCustomerForm);
registerModal('edit-customer-modal', openEditForm);

on('customer:created', async () => {
	await customersModule.fetch();
});
