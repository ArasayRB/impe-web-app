import { modalController } from '@/lib/modal.controller';
import { t, waitForI18n } from '@/lib/i18n/i18n';
import { exportCsv } from '@/services/export.csv';
import { confirmAction } from '@/lib/confirmAction';
import { importFile } from '@/services/import.service';
import { createViewEngine } from '@/lib/createViewEngineUi';
import type {CrudColumn} from '@/lib/crudColumn';


type CrudUIConfig<T> = {
  el: HTMLElement;
  module: any;
  columns: CrudColumn<T>[];
	translations?: string;
	actions?: CrudActions;
  export?: {
    filename: string;
    columns: {
      key: string;
      label: string;
      format?: (
        value: any,
        row: any
      ) => string;
    }[];
  };
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onRemove?: (row: T) => void;
  onRemoveSuccess?: (row?: T) => void;
  onRemoveError?: (error: any) => void;
  onImport?: (
    rows: Record<string, any>[]
  ) => Promise<void>;
  onBulkDelete?: (
    ids: number[]
  ) => Promise<void>;
	getFilters?: () => Record<string, any>;
  onInfo?: () => void;
};

type CrudActions = {
  edit?: boolean;
  delete?: boolean;
  import?: boolean;
  bulk_delete?: boolean;
  info?: boolean;
	settings?:boolean;
};


export async function mountCrud<T>(config: CrudUIConfig<T>) {
  const { 
	el, 
	module, 
	columns, 
	translations, 
	actions, 
  export,
	onEdit, 
	onDelete, 
	onRemove, 
  onRemoveSuccess,
  onRemoveError, 
	getFilters,
  onInfo
} = config;

  await waitForI18n();

  //For module actions allowed
	const enabledActions = {
		edit: true,
		delete: true,
		...actions,
	};

  //For bulk delete purposes
  const selectedIds = new Set<number>();

  const extraColumns =
    (enabledActions.edit ? 1 : 0) +
    (enabledActions.delete ? 1 : 0);

  const bulkColumn =
    hasActionsMenu() ? 1 : 0;

  const totalColumns =
    columns.length +
    extraColumns +
    bulkColumn;
  
  createViewEngine({
    module,
    segments: {
    init: () => {
      renderHead();
    },

    state: () => {
      renderTable(module.getState());
      renderPagination(module.getState());
    },

    i18n: () => {
      renderHead();
    }
  }
  });
  // ---------------------------
  // helpers
  // ---------------------------

	function getQuery(page?: number) {
		const filters = getFilters?.() || {};

		return {
			...filters,
			...(page ? { page } : {}),
		};
	}


  function getValue(obj: any, path: string) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }

  function qs<T extends HTMLElement>(selector: string) {
    return el.querySelector(selector) as T | null;
  }

  function syncSelectAll() {
    const selectAll =
      qs<HTMLInputElement>('[data-select-all]');

    if (!selectAll) return;

    const checkboxes =
      el.querySelectorAll<HTMLInputElement>(
        'input[data-id]'
      );

    const checked =
      Array.from(checkboxes).filter(c => c.checked);

    selectAll.checked =
      checkboxes.length > 0 &&
      checked.length === checkboxes.length;
  }

  // ---------------------------
  // THEAD
  // ---------------------------

  function renderHead() {
    const theadRow = qs<HTMLTableRowElement>('thead tr');
    if (!theadRow) return;

    theadRow.innerHTML = `
      ${
        hasActionsMenu()
          ? `
            <th class="p-4">
              <input
                class="flex pl-0 mt-3 mr-3 space-x-1 sm:pl-2 sm:mt-0"
                type="checkbox"
                data-select-all
              />
            </th>
            `
          : ''
      }
      ${columns
        .map(
          (col) => `
          <th class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
            ${t(col.label)}
          </th>
        `
        )
        .join('')}
      <th class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">${t(`${translations}.columns.actions`)}</th>
    `;
  }

  // ---------------------------
  // TBODY
  // ---------------------------

  function renderTable(state: any) {
    selectedIds.clear();
    updateBulkActions();
    hideIfNotExtraActions();
    const tbody = qs<HTMLTableSectionElement>('#table-body');
    if (!tbody) return;

    if (state.loading) {
      tbody.innerHTML = `
        <tr>
          <td colspan="${totalColumns}" class="p-4 text-base text-gray-900 whitespace-nowrap dark:text-white text-center">
            Loading...
          </td>
        </tr>
      `;
      return;
    }console.log('data documents templates', state.data)

    if (!state.data?.length) {
      tbody.innerHTML = `<tr><td colspan="${
        totalColumns
      }" class="p-4 text-base text-gray-900 whitespace-nowrap dark:text-white text-center">No data</td></tr>`;
      return;
    }

    tbody.innerHTML = state.data
      .map((row: T) => {
        const tds = columns
          .map((col) => {
            const raw = getValue(row, col.key);

            const value = col.render
              ? col.render(raw, row, t)
              : raw ?? '-';
            
            if (col.component) {

               return `
                  <td class="crud-component-cell"></td>
              `;

            }
            return `<td class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">${value}</td>`;
          })
          .join('');

        return `
          <tr class="hover:bg-gray-100 dark:hover:bg-gray-700">
            ${
              hasActionsMenu()
                ? `
                  <td class="p-4">
                    <input
                      type="checkbox"
                      data-id="${(row as any).id}"
                    />
                  </td>
                  `
                : ''
            }

            ${tds}
						
            <td class="p-4">
						${enabledActions.edit ?`
              <button data-edit="${(row as any).id}" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
							<svg
								class="w-4 h-4 mr-2"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<>
									<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
									<path
										fill-rule="evenodd"
										d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
										clip-rule="evenodd"
									/>
								</>
							</svg>
							${t(translations+'.buttons.edit')}
							</button>`:''}
							${enabledActions.delete ? `
              <button data-delete="${(row as any).id}" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900">
							<svg
								class="w-4 h-4 mr-2"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill-rule="evenodd"
									d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
									clip-rule="evenodd"
								/>
							</svg>
							${t(translations+'.buttons.delete')}
							</button>`:''}
            </td>
          </tr>
        `;
      })
      .join('');

    const rows =
        tbody.querySelectorAll("tr");

    rows.forEach((tr,rowIndex)=>{

        const row =
            state.data[rowIndex];

        columns.forEach((col,colIndex)=>{

            if(!col.component) return;

            const td =
                tr.children[
                    hasActionsMenu()
                        ? colIndex+1
                        : colIndex
                ] as HTMLElement;

            col.component.mount(

                td,

                getValue(
                    row,
                    col.key
                ),

                row

            );

        });

    });
  }

  // ---------------------------
  // PAGINATION
  // ---------------------------

  function renderPagination(state: any) {
    const container = qs<HTMLElement>('[data-pagination]');
    if (!container) return;

    const { current_page = 1, last_page = 1 } = state.meta || {};

    container.innerHTML = `
      <div class="flex items-center gap-2">
        <button
				 data-prev
				 ${current_page <= 1 ? 'disabled' : ''}
				 class="inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
				>
				<svg
					class="w-5 h-5 mr-1 -ml-1"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
						clip-rule="evenodd"></path></svg
				>
				Prev
				</button>

        <span class="text-base font-normal text-gray-900 text-sm whitespace-nowrap dark:text-white">
          Page ${current_page ?? 1} of ${last_page ?? 1}
        </span>

        <button
				 data-next
				 ${current_page >= last_page ? 'disabled' : ''}
				 class="inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
				>
				Next
				<svg
					class="w-5 h-5 ml-1 -mr-1"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
						clip-rule="evenodd"></path></svg
				>
				</button>
      </div>
    `;
		// ---------------------------
		// EVENTS
		// ---------------------------

		const prevBtn = container.querySelector('[data-prev]');
		const nextBtn = container.querySelector('[data-next]');

		prevBtn?.addEventListener('click', async () => {
			if (current_page <= 1) return;

			await module.fetch(
				getQuery(current_page - 1)
			);
		});

		nextBtn?.addEventListener('click', async () => {
			if (current_page >= last_page) return;

			await module.fetch(
				getQuery(current_page + 1)
			);
		});
	}

  // ---------------------------
  // ERROR
  // ---------------------------

  function renderError(state: any) {
    const errorEl = qs<HTMLElement>('#cases-error');
    if (!errorEl) return;

    if (state.error) {
      errorEl.classList.remove('hidden');
      errorEl.innerHTML = ` ${state.error.message}
      <button data-retry class="ml-2 px-3 py-1 bg-gray-200 rounded">
        Retry
      </button>`;
    }else if (state.data===undefined) {
      errorEl.classList.remove('hidden');
      errorEl.innerHTML = ` Error unknown
      <button data-retry class="ml-2 px-3 py-1 bg-gray-200 rounded">
        Retry
      </button>`;
    } else {
      errorEl.classList.add('hidden');
      errorEl.innerHTML = '';
    }
  }

  // ---------------------------
  // RENDER
  // ---------------------------

  function render(state: any) {

    renderError(state); // SIEMPRE

    if (state.loading) return;

    renderTable(state);
    renderPagination(state);
  }

  function updateBulkActions() {

    const exportBtn =
		qs(
			'[data-export-selected]'
		);

    const trashBtn =
      qs('[data-bulk-delete]');

    

    const hasSelection = selectedIds.size > 0;

    if (exportBtn) {
      exportBtn.toggleAttribute(
        'disabled',
        !hasSelection
      );
      exportBtn.classList.toggle(
        'opacity-50',
        !hasSelection
      );

      exportBtn.classList.toggle(
        'cursor-not-allowed',
        !hasSelection
      );
    }

    if (trashBtn){
      trashBtn.toggleAttribute(
        'disabled',
        !hasSelection
      );

      trashBtn.classList.toggle(
        'opacity-50',
        !hasSelection
      );

      trashBtn.classList.toggle(
        'cursor-not-allowed',
        !hasSelection
      );
    }
  }

  function hideIfNotExtraActions() {console.log('hide extra actions')
    if (
      !config.onImport &&
      !config.export &&
      !enabledActions.import
    ){
      document
      .querySelector('[data-actions-toggle]')
      ?.classList.add('hidden')
    }
  }

  function hasSelectionFeatures() {
    return (
      !!config.onBulkDelete ||
      !!config.export
    );
  }

  function hasActionsMenu() {
    return (
      !!config.onBulkDelete ||
      !!config.onImport ||
      !!config.export
    );
  }

  async function bulkRemove()
  {
    if (!selectedIds.size) return;

    confirmAction({
      modalId: `delete-${translations}-modal`,          
      svg:'',
      title: t('common.messages.remove'),
      message: `${selectedIds.size} ${t('sidebar.dashboard.'+translations)} ${t('common.messages.selected')}`,
      onConfirm: async () => {

        await config.onBulkDelete?.(
          Array.from(selectedIds)
        );

        modalController.close(`delete-${translations}-modal`);

        updateBulkActions();

        await module.fetch();

        showSuccess(
          t('customers.messages.deleted')
        );
      }
    });
  }

  // ---------------------------
  // EVENTS (delegation)
  // ---------------------------  

  el.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;

    const state = module.getState();

    //for submenus crud listener
    const menu = el.querySelector(
      '[data-actions-menu]'
    );

    if (
      !target.closest('[data-actions-toggle]') &&
      !target.closest('[data-actions-menu]')
    ) {
      menu?.classList.add('hidden');
    }



   if (target.matches('[data-next]')) {
			await module.fetch(
				getQuery(state.meta.current_page + 1)
			);
		}

		if (target.matches('[data-prev]')) {
			await module.fetch(
				getQuery(state.meta.current_page - 1)
			);
		}

		if (target.matches('[data-create-customer]')) {
      modalController.close('add-case-modal');
			modalController.open('add-customer-modal', {
        from: 'case'
      });
		}

    // ✅ RETRY GLOBAL
    if (target.matches('[data-retry]')) {
      await module.fetch();
    }

    //Get remove item response by user
    if (target.matches('[data-remove]')) {
      const remove = target.dataset.remove;
      const id = target.dataset.id;
      if (remove !== 'yes') return;

			try {
				await onRemove(id);

				modalController.close(`delete-${translations}-modal`);

				onRemoveSuccess?.();

			} catch (error) {
				console.error(error);

				onRemoveError?.(error);
			}
    }

  //Extra submenus in table crud
  const toggleBtn = target.closest(
    '[data-actions-toggle]'
  );

  if (toggleBtn) {
    const menu = el.querySelector(
      '[data-actions-menu]'
    );

    menu?.classList.toggle('hidden');
  }
  

  //Infos Dashboard
	const infoBtn =
    (target as HTMLElement).closest(
      '[data-info]'
    );
		

  if (infoBtn) {
    onInfo?.();
  }
    

  //BULK - REMOVE
  const checkbox =
    target.closest(
      '[data-id]'
    ) as HTMLInputElement | null;

  if (
    checkbox &&
    checkbox.type === 'checkbox'
  ) {

    const id = Number(
      checkbox.dataset.id
    );

    if (checkbox.checked) {
      selectedIds.add(id);
    } else {
      selectedIds.delete(id);
    }

    updateBulkActions();
  }
console.log('target clicked to remove',target);
    if (
      target.closest('[data-bulk-delete]')
      ){console.log('clicked bulk-delete-icon','selected: '+selectedIds.size)

      bulkRemove();
    }

		const editBtn = (e.target as HTMLElement).closest('[data-edit]') as HTMLElement | null;

    if (editBtn) {
			const id = editBtn.dataset.edit;

			const state = module.getState();
			const row = state.data.find((r: any) => String(r.id) === String(id));

			if (!row) return;

			onEdit?.(row);
		}

		const deleteBtn = (e.target as HTMLElement).closest('[data-delete]') as HTMLElement | null;

		if (deleteBtn) {
			const id = deleteBtn.dataset.delete;

			if (!id) return;

      const state = module.getState();
			const row = state.data.find((r: any) => String(r.id) === String(id));

      onDelete?.(row);
		}
  });

  //BULK - IMPORT
  const importBtn =
  document.querySelector('[data-import]');

  const importInput =
    document.querySelector('[data-import-file]');
  
  //hide btn if not came config 
  if(!enabledActions.import){
    document
    .querySelector('[data-import]')
    ?.classList.add('hidden')
  }

	if(!enabledActions.bulk_delete){
    document
    .querySelector('[data-bulk-delete]')
    ?.classList.add('hidden')
  }

	if(!enabledActions.info){
    document
    .querySelector('[data-info]')
    ?.classList.add('hidden')
  }  

	if(!enabledActions.settings){
    document
    .querySelector('[data-settings]')
    ?.classList.add('hidden')
  }
  

  //listeners
  importBtn?.addEventListener('click', () => {
    importInput?.click();
  });

  importInput?.addEventListener(
    'change',
    async (e) => {

      const file =
        (e.target as HTMLInputElement)
          .files?.[0];

      if (!file) return;

      const rows = await importFile(file);
      await config.onImport?.(rows);
      importInput.value = '';
    }
  );

  //EXPORT CSV
  //hide btn if not came config
  if(!config.export){
    document
    .querySelector('[data-export]')
    ?.classList.add('hidden')
    document
    .querySelector('[data-export-all]')
    ?.classList.add('hidden')
    document
    .querySelector('[data-export-selected]')
    ?.classList.add('hidden')
  }

  //listener
  document
  .querySelector('[data-export-all]')
  ?.addEventListener('click', async () => {

    const state = module.getState();

    exportCsv(
      config.export.filename,
      state.data,
      config.export.columns
    );
  });

  document
  .querySelector('[data-export-selected]')
  ?.addEventListener('click', async () => {

    if (!config.export) return;

      const state = module.getState();

      const rows =
        state.data.filter(
          (row: any) =>
            selectedIds.has(row.id)
        );

      exportCsv(
        `${config.export.filename}-selected`,
        rows,
        config.export.columns
      );
  });

  // ---------------------------
  // INIT
  // ---------------------------

  renderHead();

  const initial = JSON.parse(el.dataset.initial || '{}');
  module.hydrate(initial);

  render(module.getState());

  const selectAll =
    qs<HTMLInputElement>('[data-select-all]');

  selectAll?.addEventListener('change', () => {

    const checked = selectAll.checked;

    el.querySelectorAll<HTMLInputElement>(
      'input[data-id]'
    ).forEach(cb => {

      cb.checked = checked;

      const id = cb.dataset.id;

      if (!id) return;

      if (checked) {
        selectedIds.add(id);
      } else {
        selectedIds.delete(id);
      }
    });

    updateBulkActions();
  });

  module.subscribe(render);
}
