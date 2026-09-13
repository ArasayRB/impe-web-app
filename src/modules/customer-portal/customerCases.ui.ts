import { customerPortalApiFetch } from '@/services/customerPortal.api';
import { t } from '@/lib/i18n/i18n';

export function mountCustomerCases(
	root: HTMLElement
) {
	console.log(
		'[CUSTOMER CASES MOUNT]',
		root
	);
	customerPortalApiFetch('/v1/customer/cases')
		.then((response) => {
			const cases =
				response?.data?.data || [];

			if (!cases.length) {
				root.innerHTML = `
					<div class="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
						<p class="text-sm text-gray-500 dark:text-gray-400">
							${t('common.messages.error')}
						</p>
					</div>
				`;

				return;
			}

			root.innerHTML = `
				<div class="grid items-start gap-6 md:grid-cols-2">
					${cases.map((item) => `
						<article
							class="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
							data-case-id="${item.id}"
						>
							<div class="p-6">
								<div class="flex items-start justify-between gap-4">
									<div class="min-w-0">
										<p class="text-sm text-gray-500 dark:text-gray-400">
											${item.case_number ?? ''}
										</p>

										<h2 class="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
											${item.title ?? ''}
										</h2>
									</div>

									<span class="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
										${item.status ?? ''}
									</span>
								</div>
							</div>

							<div class="border-t border-gray-200 px-6 py-5 dark:border-gray-700">
								<div class="flex items-center justify-between">
									<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
										${t('cases.analytics.workflow')}
									</h3>

									<button
										type="button"
										data-workflow-toggle
										class="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-500"
									>
										${t('cases.buttons.workflow')}
									</button>
								</div>

								<div
									class="mt-5 hidden"
									data-workflow
								>
									<div class="relative pb-2">
										${renderWorkflow(item.workflow.workflow)}
									</div>
								</div>
							</div>
						</article>
					`).join('')}
				</div>
			`;

			bindWorkflowToggles(root);
		})
		.catch((error) => {
			console.error(
				'[CUSTOMER PORTAL CASES ERROR]',
				error
			);

			root.innerHTML = `
				<div class="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
					<p class="text-sm text-red-600 dark:text-red-400">
						${t('common.messages.error')}
					</p>
				</div>
			`;
		});
}

function bindWorkflowToggles(
	root: HTMLElement
) {
	root
		.querySelectorAll<HTMLButtonElement>(
			'[data-workflow-toggle]'
		)
		.forEach((button) => {
			button.addEventListener(
				'click',
				() => {
					const card =
						button.closest('[data-case-id]');

					const workflow =
						card?.querySelector(
							'[data-workflow]'
						);

					if (!workflow) return;

					const isHidden =
						workflow.classList.contains(
							'hidden'
						);

					root
						.querySelectorAll(
							'[data-workflow]'
						)
						.forEach((item) => {
							item.classList.add('hidden');
						});

					if (isHidden) {
						workflow.classList.remove(
							'hidden'
						);
					}
				}
			);
		});
}

function renderWorkflow(
	workflow: any
): string {
	if (
		!workflow?.steps?.length
	) {
		return `
			<p class="text-sm text-gray-500 dark:text-gray-400">
				${t('common.messages.error')}
			</p>
		`;
	}

	return workflow.steps
		.map((step, index) => {
			const connector =
				index <
				workflow.steps.length - 1
					? `
						<div class="absolute left-[15px] top-8 h-full w-px bg-gray-200 dark:bg-gray-700"></div>
					`
					: '';

			let statusHtml = '';

			if (
				step.status ===
				'completed'
			) {
				statusHtml = `
					<div class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-500 bg-green-50 text-green-600 dark:border-green-400 dark:bg-green-900/30 dark:text-green-400">
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
			} else if (
				step.status === 'active'
			) {
				statusHtml = `
					<div class="h-3 w-3 rounded-full bg-green-500 dark:bg-green-400"></div>
				`;
			} else {
				statusHtml = `
					<div class="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
				`;
			}

			const activeBadge =
				step.status === 'active'
					? `
						<span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
							${t('cases.analytics.active')}
						</span>
					`
					: '';

			const completedBadge =
				step.status ===
				'completed'
					? `
						<span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
							${t('cases.analytics.completed')}
						</span>
					`
					: '';

			const dates =
				step.started_at ||
				step.finished_at
					? `
						<div class="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
							${
								step.started_at
									? `
										<span>
											${t('cases.workflow.started')}:
											${formatDate(step.started_at)}
										</span>
									`
									: ''
							}

							${
								step.finished_at
									? `
										<span>
											${t('cases.workflow.finished')}:
											${formatDate(step.finished_at)}
										</span>
									`
									: ''
							}
						</div>
					`
					: '';

			return `
				<div class="relative flex gap-4 pb-8 last:pb-0">
					${connector}

					<div class="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-white dark:bg-gray-800">
						${statusHtml}
					</div>

					<div class="min-w-0 flex-1">
						<div class="flex flex-wrap items-center gap-2">
							<h4 class="font-medium text-gray-900 dark:text-white">
								${step.label || step.key}
							</h4>

							${activeBadge}
							${completedBadge}
						</div>

						${dates}
					</div>
				</div>
			`;
		})
		.join('');
}

function formatDate(
	value: string
) {
	if (!value) return '';

	return new Intl.DateTimeFormat(
		document.documentElement.lang ||
			'en',
		{
			dateStyle: 'medium',
		}
	).format(new Date(value));
}
