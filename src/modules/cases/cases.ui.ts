import { casesModule } from './cases.store';
import {showError} from '@/lib/toast';
import {confirmAction} from '@/lib/confirmAction';
import { customersModule } from '@/modules/customers/customers.store';
import { casetypesModule } from '@/modules/case_types/casetypes.store';
import { resolveCrudFields } from "@/lib/resolveCrudFields";
import { renderCaseDocuments } from '@/ui/CaseDocuments/CaseDocuments';
import {fetchDocumentTemplates, documentTemplatesModule} from '@/modules/document_templates/document-templates.store';
import { mountCrudForm } from '@/lib/createCrudForm';
import { renderStatusPill } from '@/lib/ui.helpers';
import { mountCrud } from '@/lib/createCrudUi';
import { modalController } from '@/lib/modal.controller';
import type { Field } from '@/lib/createCrudForm';
import { caseFields, caseFormTabs } from './cases.form.config';
import {
    validateCaseWorkflowStatus,
    type CaseWorkflowValidationResult
} from './cases.workflow';
import { initSite } from '@/lib/site.store';
import { registerModal } from '@/lib/modal.registry';
import { openAddCustomerForm } from '@/modules/customers/customers.ui';
import { on } from '@/lib/event.bus';
import { debounce } from '@/lib/debounce';
import { t } from '@/lib/i18n/i18n';
import { getWorkflow } from './cases.service';
import { renderCaseData } from './cases.data';

interface CasePersonFormValue {
    person_id: number;
    label: string;
    relationship: string;
}

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

            ?? null,
					
				related_people:
					payload.related_people ? payload.related_people
						.map((person: CasePersonFormValue) => ({

								person_id:
										person.person_id,

								relationship:
										person.relationship

						})):[],

        data:
            payload.data ?? {}

    };

}

function renderCaseDataTab(
    container: HTMLElement,
    context: {
        mode: 'create' | 'edit';
        data: any;
    }
) {

    if (
        context.mode === 'create' ||
        !context.data?.id
    ) {

        container.innerHTML = `
            <div class="
                p-6
                text-center
                text-sm
                text-gray-500
                dark:text-gray-400
            ">
                ${t('cases.data.save_first')}
            </div>
        `;

        return;
    }

    const fields =
        context.data.type
            ?.definition
            ?.data
            ?.config
            ?.fields
        ?? [];

    if (!fields.length) {

        container.innerHTML = `
            <div class="
                p-6
                text-center
                text-sm
                text-gray-500
                dark:text-gray-400
            ">
                ${t('cases.data.empty')}
            </div>
        `;

        return;
    }

    const values =
        context.data.definition_json
            ?.data
            ?.values
        ?? {};

    const renderer = renderCaseData({
        container,
        fields,
        values
    });
		return renderer;
}

async function renderCaseDocumentsTab(
    container: HTMLElement,
    context: {
        mode: 'create' | 'edit';
        data: any;
    }
) {

    if (
        context.mode === 'create' ||
        !context.data?.id
    ) {

        container.innerHTML = `
            <div class="
                p-6
                text-center
                text-sm
                text-gray-500
                dark:text-gray-400
            ">
                ${t('cases.documents.save_first')}
            </div>
        `;

        return;
    }

    await fetchDocumentTemplates({
        active: 1
    });

    const templates =
        documentTemplatesModule.getState().data ?? [];

    renderCaseDocuments({

        container,

        caseId:
            context.data.id,

        caseType:
            context.data.type,

        documentTemplates:
            templates

    });
}

function confirmCaseWorkflowForce(
    result: CaseWorkflowValidationResult
): Promise<boolean> {

    return new Promise(resolve => {

        confirmAction({

            modalId: 'delete-cases-modal',

            svg: `
                <svg
                    class="w-16 h-16 mx-auto text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                </svg>
            `,

            title:
                t('cases.messages.workflow_warning'),

            message:
                result.message ??
                t('cases.messages.workflow_requirement'),

            onConfirm: async () => {
                resolve(true);
            },

            errorMessage:
                t('common.errors.UNKNOWN')
        });

        /*
        * We need cancellation/close to resolve false.
        *
        * This part depends on how your modalController
        * exposes close events.
        */
    });
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
		
		related_people:
			(row.entity_people ?? []).map(person => ({
					person_id: person.person_id,
					label: person.person.name,
					relationship: person.relationship
			})),

		enable_inbound_email:
    !!row.email_case,

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
		tabs: caseFormTabs,
		tabRenderers: {
    		data: renderCaseDataTab,
				documents: renderCaseDocumentsTab
		},
    modalId: 'edit-case-modal',
    translations:'cases',
		beforeSubmit: async ({
				payload,
				data
		}) => {

				/*
				* Only workflow status changes
				* require workflow validation.
				*/
				if (
						payload.status === undefined ||
						payload.status === data?.status
				) {
						return {
								proceed: true,
								payload
						};
				}

				const result =
						validateCaseWorkflowStatus(
								data.definition_json,
								payload.status
						);

				if (result.valid) {

						return {
								proceed: true,
								payload
						};
				}

				/*
				* Invalid transition cannot be forced.
				*/
				if (result.invalidTransition) {

						showError(
								result.message ??
								t('common.errors.UNKNOWN')
						);

						return {
								proceed: false
						};
				}

				/*
				* Requirement is incomplete.
				* Ask the user whether to force it.
				*/
				const confirmed =
						await confirmCaseWorkflowForce(
								result
						);

				if (!confirmed) {

						return {
								proceed: false
						};
				}

				return {
						proceed: true,
						payload: {
								...payload,
								force: true
						}
				};
		},
    getData: () => formRow,
    transform:transformCasePayload
  });
  modalController.setHtmlText('edit-case-modal','data-from="case"', t('cases.buttons.create_customer'));
	modalController.setHtmlText('edit-case-modal','data-modal-title', t('cases.buttons.edit'));
  modalController.open('edit-case-modal');
}

function formatWorkflowDate(
	value: string | null
): string {

	if (!value) {
		return '';
	}

	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return value;
	}

	return new Intl.DateTimeFormat(undefined, {
		dateStyle: 'medium',
		timeStyle: 'short'
	}).format(date);
}


function renderCaseWorkflow(
	container: HTMLElement,
	response: CaseWorkflowResponse
): void {

	const caseData = response.data.case;
	const workflow = response.data.workflow;

	const tWorkflow = (key: string): string => {
		return t(`cases.workflow.${key}`);
	};

	const tAnalytics = (key: string): string => {
		return t(`cases.analytics.${key}`);
	};


	const statusBadge = workflow.paused
		? `
			<span
				class="
					inline-flex
					items-center
					rounded-full
					bg-yellow-100
					px-3
					py-1
					text-xs
					font-medium
					text-yellow-800
					dark:bg-yellow-900/30
					dark:text-yellow-400
				"
			>
				${tAnalytics('paused')}
			</span>
		`
		: workflow.current_step
			? `
				<span
					class="
						inline-flex
						items-center
						rounded-full
						bg-green-100
						px-3
						py-1
						text-xs
						font-medium
						text-green-800
						dark:bg-green-900/30
						dark:text-green-400
					"
				>
					${tAnalytics('active')}
				</span>
			`
			: '';


	const stepsHtml = workflow.steps
		.map((step: CaseWorkflowStep, index: number) => {

			const connector =
				index < workflow.steps.length - 1
					? `
						<div
							class="
								absolute
								left-[15px]
								top-8
								h-full
								w-px
								bg-gray-200
								dark:bg-gray-700
							"
						></div>
					`
					: '';


			let statusHtml = '';

			if (step.status === 'completed') {

				statusHtml = `
					<div
						class="
							flex
							h-8
							w-8
							items-center
							justify-center
							rounded-full
							border-2
							border-green-500
							bg-green-50
							text-green-600
							dark:border-green-400
							dark:bg-green-900/30
							dark:text-green-400
						"
					>
						<svg
							class="h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2.5"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
				`;

			} else if (step.status === 'active') {

				statusHtml = `
					<div
						class="
							h-3
							w-3
							rounded-full
							bg-green-500
							dark:bg-green-400
						"
					></div>
				`;

			} else {

				statusHtml = `
					<div
						class="
							h-2
							w-2
							rounded-full
							bg-gray-400
							dark:bg-gray-500
						"
					></div>
				`;
			}


			const activeBadge =
				step.status === 'active'
					? `
						<span
							class="
								inline-flex
								items-center
								rounded-full
								bg-green-100
								px-2.5
								py-0.5
								text-xs
								font-medium
								text-green-800
								dark:bg-green-900/30
								dark:text-green-400
							"
						>
							${tAnalytics('active')}
						</span>
					`
					: '';


			const completedBadge =
				step.status === 'completed'
					? `
						<span
							class="
								inline-flex
								items-center
								rounded-full
								bg-gray-100
								px-2.5
								py-0.5
								text-xs
								font-medium
								text-gray-700
								dark:bg-gray-700
								dark:text-gray-300
							"
						>
							${tAnalytics('completed')}
						</span>
					`
					: '';


			const forcedBadge =
				step.forced
					? `
						<span
							class="
								inline-flex
								items-center
								gap-1
								rounded-full
								bg-yellow-100
								px-2.5
								py-0.5
								text-xs
								font-medium
								text-yellow-800
								dark:bg-yellow-900/30
								dark:text-yellow-400
							"
						>
							<svg
								class="h-3.5 w-3.5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16a2 2 0 001.73 3z"
								/>
							</svg>

							${tWorkflow('forced')}
						</span>
					`
					: '';


			const datesHtml =
				step.started_at || step.finished_at
					? `
						<div
							class="
								mt-2
								flex
								flex-wrap
								gap-x-6
								gap-y-1
								text-xs
								text-gray-500
								dark:text-gray-400
							"
						>

							${step.started_at
								? `
									<span>
										${tWorkflow('started')}:
										${formatWorkflowDate(step.started_at)}
									</span>
								`
								: ''
							}

							${step.finished_at
								? `
									<span>
										${tWorkflow('finished')}:
										${formatWorkflowDate(step.finished_at)}
									</span>
								`
								: ''
							}

						</div>
					`
					: '';


			const forceDetailsHtml =
				step.force_details.length > 0
					? `
						<div
							class="
								mt-4
								rounded-lg
								border
								border-yellow-200
								bg-yellow-50
								p-4
								dark:border-yellow-800
								dark:bg-yellow-900/10
							"
						>

							<div
								class="
									mb-3
									text-sm
									font-medium
									text-yellow-800
									dark:text-yellow-400
								"
							>
								${tWorkflow('force_details')}
							</div>

							<div class="space-y-4">

								${step.force_details
									.map((detail) => {

										const metadata =
											detail.metadata;

										const requirements =
											metadata.requirements
												.length > 0
												? `
													<div class="mt-3">

														<p
															class="
																text-xs
																font-medium
																text-yellow-800
																dark:text-yellow-400
															"
														>
															${tWorkflow('requirements')}
														</p>

														<ul
															class="
																mt-1
																list-disc
																pl-5
																text-xs
																text-gray-700
																dark:text-gray-300
															"
														>
															${metadata.requirements
																.map(
																	(requirement) =>
																		`<li>${requirement}</li>`
																)
																.join('')}
														</ul>

													</div>
												`
												: '';


										return `
											<div
												class="
													border-b
													border-yellow-200
													pb-3
													last:border-0
													last:pb-0
													dark:border-yellow-800
												"
											>

												<p
													class="
														text-sm
														text-gray-700
														dark:text-gray-300
													"
												>
													${detail.description}
												</p>

												<div
													class="
														mt-2
														grid
														gap-1
														text-xs
														text-gray-600
														dark:text-gray-400
													"
												>

													${metadata.from_step_label
														? `
															<span>
																<strong>
																	${tWorkflow('from')}:
																</strong>
																${metadata.from_step_label}
															</span>
														`
														: ''
													}

													${metadata.to_step_label
														? `
															<span>
																<strong>
																	${tWorkflow('to')}:
																</strong>
																${metadata.to_step_label}
															</span>
														`
														: ''
													}

													${metadata.from_status
														? `
															<span>
																<strong>
																	${tWorkflow('from_status')}:
																</strong>
																${metadata.from_status}
															</span>
														`
														: ''
													}

													${metadata.to_status
														? `
															<span>
																<strong>
																	${tWorkflow('to_status')}:
																</strong>
																${metadata.to_status}
															</span>
														`
														: ''
													}

												</div>

												${requirements}

												<div
													class="
														mt-3
														text-xs
														text-gray-500
														dark:text-gray-400
													"
												>
													${formatWorkflowDate(
														detail.created_at
													)}
												</div>

											</div>
										`;
									})
									.join('')}

							</div>
						</div>
					`
					: '';


			return `
				<div
					class="relative flex gap-4 pb-8 last:pb-0"
					data-workflow-step="${step.key}"
				>

					${connector}

					<div
						class="
							relative
							z-10
							flex
							h-8
							w-8
							shrink-0
							items-center
							justify-center
							rounded-full
							border-2
						"
					>
						${statusHtml}
					</div>

					<div class="min-w-0 flex-1">

						<div
							class="
								flex
								flex-wrap
								items-center
								gap-2
							"
						>

							<h3
								class="
									font-medium
									text-gray-900
									dark:text-white
								"
							>
								${step.label || step.key}
							</h3>

							${activeBadge}

							${completedBadge}

							${forcedBadge}

						</div>

						${datesHtml}

						${forceDetailsHtml}

					</div>

				</div>
			`;
		})
		.join('');


	container.innerHTML = `
		<div
			class="p-6"
			data-case-id="${caseData.id}"
		>

			<!-- Header -->

			<div
				class="
					mb-6
					flex
					flex-wrap
					items-center
					justify-between
					gap-3
				"
			>

				<div>

					<h1
						class="
							text-2xl
							font-semibold
							text-gray-900
							dark:text-white
						"
					>
						${caseData.case_number}
					</h1>

					<p
						class="
							mt-1
							text-sm
							text-gray-500
							dark:text-gray-400
						"
					>
						${tWorkflow('title')}
					</p>

				</div>

				<span
					class="
						inline-flex
						items-center
						rounded-full
						bg-gray-100
						px-3
						py-1
						text-sm
						font-medium
						text-gray-700
						dark:bg-gray-700
						dark:text-gray-200
					"
				>
					${caseData.status}
				</span>

			</div>


			<!-- Workflow -->

			<div
				class="
					rounded-lg
					border
					border-gray-200
					bg-white
					p-6
					shadow-sm
					dark:border-gray-700
					dark:bg-gray-800
				"
			>

				<div
					class="
						mb-8
						flex
						flex-wrap
						items-center
						justify-between
						gap-3
					"
				>

					<div>

						<h2
							class="
								text-lg
								font-semibold
								text-gray-900
								dark:text-white
							"
						>
							${tAnalytics('workflow')}
						</h2>

						<p
							class="
								mt-1
								text-sm
								text-gray-500
								dark:text-gray-400
							"
						>
							${tWorkflow('current_process')}
						</p>

					</div>

					<div class="flex items-center gap-2">
						${statusBadge}
					</div>

				</div>

				<div class="relative">
					${stepsHtml}
				</div>

			</div>

		</div>
	`;
}

async function openWorkflow(row: any): Promise<void> {

	console.log('row', row);

	const modal =
		document.getElementById(
			'case-workflow-modal'
		);

	if (!modal) {
		console.warn(
			'[Cases] Workflow modal not found'
		);
		return;
	}

	const container =
		modal.querySelector(
			'[data-workflow-container]'
		) as HTMLElement | null;

	if (!container) {
		console.warn(
			'[Cases] Workflow container not found'
		);
		return;
	}

	container.innerHTML = `
		<div
			class="
				p-8
				text-center
				text-sm
				text-gray-500
				dark:text-gray-400
			"
		>
			${t('common.messages.loading')}
		</div>
	`;

	modalController.open(
		'case-workflow-modal'
	);

	try {

		const response =
			await getWorkflow(row.id);

		renderCaseWorkflow(
			container,
			response
		);

	} catch (error: any) {

		console.error(
			'[Cases] Workflow error',
			error
		);

		container.innerHTML = `
			<div
				class="
					p-6
					text-center
					text-sm
					text-red-600
					dark:text-red-400
				"
			>
				${error?.message ??
					t('common.errors.UNKNOWN')}
			</div>
		`;
	}
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
		tabs: caseFormTabs,
		tabRenderers: {
    		data: renderCaseDataTab,
				documents: renderCaseDocumentsTab
		},
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
      { key: 'customer.name', label: 'cases.columns.customer' },
      { key: 'customer.email', label: 'cases.columns.email' },
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
			workflow: true,
		},

  	getFilters: () => currentFilters,
		
		// AQUÍ conectamos EDIT
    onEdit: (row) => {
      openEditForm(row);
    },

    // DELETE modal show
    onDelete: async (row) => {
      openRemoveForm(row);
    },

    //  DELETE fetch
    onRemove: async (id) => {
      await casesModule.deleteItem(id);
      
      await casesModule.fetch(currentFilters);
    },
		onInfo: () => {
			window.location.href =
				'/dashboard/analytics/cases';
		},

		onWorkflow: (row) => {
				openWorkflow(row);
		},
  });

  mountCaseSearch();
}
registerModal('add-case-modal', openAddForm);
registerModal('edit-case-modal', openEditForm);
registerModal('add-customer-modal', openAddCustomerForm);
registerModal('case-workflow-modal',openWorkflow);

on('case:created', async () => {
  await casesModule.fetch();
});
