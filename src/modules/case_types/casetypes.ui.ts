import { casetypesModule } from './casetypes.store';
import { mountCrudForm } from '@/lib/createCrudForm';
import { mountCrud } from '@/lib/createCrudUi';
import { confirmAction } from '@/lib/confirmAction';
import { initSite } from '@/lib/site.store';
import { modalController } from '@/lib/modal.controller';
import { registerModal } from '@/lib/modal.registry';
import type { Field } from '@/lib/createCrudForm';
import { casetypesFields } from './casetypes.form.config';
import { emit } from '@/lib/event.bus';
import { t } from '@/lib/i18n/i18n';
import { resolveTranslation } from '@/lib/i18n/resolveTranslations';
import { on } from '@/lib/event.bus';
import { debounce } from '@/lib/debounce';
import {showSuccess,showError} from '@/lib/toast';
import { createCrudSwitch } from '@/lib/crud/components/createCrudSwitch';

const fields: Field[] = casetypesFields;
let selectedCaseTypesId: string | number | null = null;
let autocompleteInstance: any = null;
let currentFilters: Record<string, any> = {};

function mountCaseTypesSearch() {
	const form = document.querySelector('[data-form="casetypes-search"]');
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

		casetypesModule.fetch(currentFilters);
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
			await casetypesModule.fetch(currentFilters);
		} catch (e) {
			console.error('search error', e);
		}
	}, 300);

	input.addEventListener('input', (e) => {
		const value = (e.target as HTMLInputElement).value;
		search(value);
	});
}

function openEditForm(row: any) {
	const modal = document.getElementById('edit-casetypes-modal');
	if (!modal) return;

	const container = modal.querySelector('[data-form-container]');
	if (!container) return;console.log('Row to edit',row);

	mountCrudForm({
		el: container,
		module: casetypesModule,
		mode: 'edit',
		fields,
		modalId: 'edit-casetypes-modal',
		translations:'casetypes',
		getData: () => row,
	});

	const definitionContainer = modal.querySelector(

		"[data-definition]"

	);

	modalController.setHtmlText('edit-casetypes-modal','data-modal-title', t('casetypes.buttons.edit'));
	modalController.open('edit-casetypes-modal');
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
		modalId: 'delete-casetypes-modal',
		svg:svgString,
		title:`${t('common.messages.remove')}`,
		message:`${t('common.messages.shure_remove')}: ${row.name}`,
		onConfirm: async () => {
			await casetypesModule.deleteItem(row.id);

			await casetypesModule.fetch();
		},
		successMessage:t('common.messages.deleted'),
		errorMessage:t('common.errors.UNKNOWN')
	});
}

export function openAddCaseTypesForm(id: string, context?: any) {console.log('context for add casetypes form',context)
  const container = document
    .getElementById(id)
    ?.querySelector('[data-form-container]');

  if (!container) return;

	const resolvedFields = resolveTranslation(fields);

  mountCrudForm({
    el: container,
    module: casetypesModule,
    mode: 'create',
    fields: resolvedFields,
    modalId: id,
    translations:'casetypes',
    onSuccess: async (res) => {
      if (!res?.data) return;
      

      if (context?.from === 'case') {
      	emit('casetypes:created', res.data);
        setTimeout(() => {
          modalController.setHtmlText('add-case-modal','data-modal-title', t('cases.buttons.add'));
  				modalController.open('add-case-modal',context);
        }, 0);
      }else{
				await casetypesModule.fetch(currentFilters);
			}
    },
  });

  modalController.setHtmlText('add-casetypes-modal','data-modal-title', t('casetypes.buttons.add'));
  modalController.open(id,context);
}

export async function mountCaseTypes(el: HTMLElement) {
	
	const root = document.getElementById('casetypes-root');

	if (root?.dataset.site) {
		initSite(JSON.parse(root.dataset.site));
	}

	const columnsData = [
			{ key: 'name', label: 'casetypes.columns.name' },
			{ key: 'slug', label: 'casetypes.columns.slug' },
			{
				key:'active',

				label:'casetypes.columns.active',

				component:
					createCrudSwitch({

						async onChange(
							value,
							row
						){

							await casetypesModule.updateItem(
								row.id,
								{
									active:value
								}
							);

						}

					})

			}
		];
	await mountCrud({
		el,
		module: casetypesModule,
		columns: columnsData,
		translations:'casetypes',

		actions: {
			edit: true,
			delete: true,
			import: false,
  		info: false,
			bulk_delete:false,
			settings:false
		},
		export: {
			filename: 'casetypes',

			columns: columnsData
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
			await casetypesModule.deleteItem(id);
			
			await casetypesModule.fetch(currentFilters);
		},

		onRemoveSuccess: async () => {
			await casetypesModule.fetch();
			showSuccess(t('common.messages.deleted'));
		},

		onRemoveError: () => {
			showError(t('common.messages.delete_error'));
		}
	});

	mountCaseTypesSearch();
}

// Register
registerModal('add-casetypes-modal', openAddCaseTypesForm);
registerModal('edit-casetypes-modal', openEditForm);

on('casetypes:created', async () => {
	await casetypesModule.fetch();
});
