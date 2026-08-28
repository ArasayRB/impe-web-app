import { documentTemplatesModule, getDocumentTemplateVariables } from './document-templates.store';
import { mountCrudForm } from '@/lib/createCrudForm';
import { mountCrud } from '@/lib/createCrudUi';
import { modalController } from '@/lib/modal.controller';
import type { Field } from '@/lib/createCrudForm';
import { documentTemplatesFields , documentTemplatesEditFields} from './document-templates.form.config';
import { initSite } from '@/lib/site.store';
import { registerModal } from '@/lib/modal.registry';
import {documentTemplateColumns} from '@/modules/document_templates/document-templates.columns.config';
import { on } from '@/lib/event.bus';
import { debounce } from '@/lib/debounce';
import { t } from '@/lib/i18n/i18n';

const fields: Field[] =  documentTemplatesFields;

const fieldsEdit: Field[] =  documentTemplatesEditFields;

let currentFilters: Record<string, any> = {};



function mountCaseSearch() {
  const form = document.querySelector('[data-form="document-templates-search"]');
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

    documentTemplatesModule.fetch(currentFilters);
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
      await documentTemplatesModule.fetch(currentFilters);
    } catch (e) {
      console.error('search error', e);
    }
  }, 300);

  input.addEventListener('input', (e) => {
    const value = (e.target as HTMLInputElement).value;
    search(value);
  });
}

function transformDocumentTemplatePayload(
	payload: any,
	formData: FormData
) {

	// CREATE
	if (formData.has('template')) {

		const data = new FormData();

		data.append(
			'name',
			payload.name ?? ''
		);

		data.append(
			'description',
			payload.description ?? ''
		);

		const template = formData.get('template');

		if (template instanceof File) {

			data.append(
				'template',
				template
			);

		}

		return data;
	}

	// EDIT
	return {

		name: payload.name ?? '',

		description:
			payload.description ?? ''

	};

}

async function openEditForm(row: any) {

	const modal = document.getElementById(
		'edit-document-templates-modal'
	);

	if (!modal) return;

	const container =
		modal.querySelector(
			'[data-form-container]'
		);

	if (!container) return;

	const formRow = {

		id: row.id,

		name: row.name,

		description: row.description ?? ''

	};

	//get doc templates vars
	const variables =
  await getDocumentTemplateVariables();
console.log('variables doc',variables)
	mountCrudForm({

		el: container,

		module: documentTemplatesModule,

		mode: 'edit',

		fields: fieldsEdit,

		modalId: 'edit-document-templates-modal',

		translations: 'document-templates',

		variables,

		getData: () => formRow,

		transform: transformDocumentTemplatePayload

	});


	modalController.setHtmlText(
		'edit-document-templates-modal',
		'data-modal-title',
		t('document-templates.buttons.edit')
	);

	modalController.open(
		'edit-document-templates-modal'
	);
}

function openRemoveForm(row: any) {
  const container = document.getElementById('delete-document-templates-modal');
  if (!container) return;

  console.log('case row to remove',row)
  //await documentTemplatesModule.deleteItem(id);
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
						${t('common.messages.shure')}
					</a>
					<a
						href="#"
						data-close-modal="delete-document-templates-modal"
            data-remove="no"
						class="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
						{/*data-modal-toggle="delete-document-templates-modal"*/}
					>
						${t('common.messages.not_shure')}
					</a>`; 
  modalController.setContent('delete-document-templates-modal',htmlContent);
  modalController.open('delete-document-templates-modal');
}


export async function openAddForm(id: string) {

	const root =
		document.getElementById(
			'document-templates-root'
		);

	if (root?.dataset.site) {

		initSite(
			JSON.parse(
				root.dataset.site
			)
		);

	}

	const container =
		document
			.getElementById(id)
			?.querySelector(
				'[data-form-container]'
			);

	if (!container) return;

	

	//get doc templates vars
	const variables =
  await getDocumentTemplateVariables();

	mountCrudForm({

		el: container,

		module: documentTemplatesModule,

		mode: 'create',

		fields,

		modalId: id,

		translations: 'document-templates',

		variables,

		onSuccess: async () => {

			await documentTemplatesModule.fetch(
				currentFilters
			);

		},

		transform:
			transformDocumentTemplatePayload,

	});


	modalController.setHtmlText(
		id,
		'data-modal-title',
		t('document-templates.buttons.add')
	);

	modalController.open(id);
}

export async function mountDocumentTemplates(el: HTMLElement) {
  
  const root = document.getElementById('document-templates-root');
console.log('root templates', root);
  if (root?.dataset.site) {
    initSite(JSON.parse(root.dataset.site));
  }

  const columnsData = documentTemplateColumns;

  await mountCrud({
    el,
    module: documentTemplatesModule,
    columns: columnsData,
    translations:'document-templates',

    
		export: {
			filename: 'document-templates',

			columns: columnsData
		},

		actions: {
			edit: true,
			delete: true,
  		info: false,
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
      await documentTemplatesModule.deleteItem(id);
      
      await documentTemplatesModule.fetch(currentFilters);
    },
  });

  mountCaseSearch();
}
registerModal('add-document-templates-modal', openAddForm);
registerModal('edit-document-templates-modal', openEditForm);

on('document-template:created', async () => {
  await documentTemplatesModule.fetch();
});
