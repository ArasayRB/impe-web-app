// src/lib/analytics/renderTable.ts
//here render table and export csv button if it's configurate
import { getSlot } from './dom';

import { showTable } from './tableController';

import { sortAnalyticsTable } from './tableSortEvents';

import {
  exportCsv
}
from './exportCsv';

import { t } from '@/lib/i18n/i18n';

import type { DashboardTable } from './types';

let activeSortColumn: string | null = null;

let activeSortDirection:
    | 'asc'
    | 'desc'
    | null = null;

let analyticsTableListener = false;

let activeAnalyticsId: string | null = null; //define were analytics context user is working

export function setActiveTable(
    tableId: string
) {
    activeAnalyticsId =
        tableId;
}

export function getActiveTable():
    string | null {

    return activeAnalyticsId;
}

export function renderTableContainer(
  el: HTMLElement,
  table: any
) {

  const container =
    getSlot(
      el,
      '[data-table]'
    );

  if (!container) {
    return;
  }

	//remove existing tables with same id
	const existing =
    container.querySelector(
        `[data-table-id="${table.id}"]`
    );

	existing?.remove();

	const card =
    document.createElement('div');

	card.dataset.tableId =
			table.id;

	card.style.display =
			table.hidden
					? 'none'
					: 'block';

	card.innerHTML = `
    <div
      class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">

			<div
				class="
					flex
					justify-between
					items-center
					mb-4
				"
			>
      <h3 
			data-i18n="${t(table.title)}"
			class="flex items-center mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        ${t(table.title)}
      </h3>
			${
				table.exportable
				? `
						<button
							data-i18n="${t(table.exportButtonTitle)}"
							data-export-csv
							class="
								px-3
								py-2
								text-sm
								rounded-lg
								bg-primary-600
								text-white
							"
						>
							${t(table.exportButtonTitle)}
						</button>
					`
				: ''
			}
			</div>

      <div class="overflow-x-auto">

        <table
          class="
						w-full
            min-w-full
            divide-y
            divide-gray-200
          "
        >

          <thead>
            <tr>
              ${
                table.columns
                  .map(
                    column => `
                      <th
												data-key="${column.key}"
                        class="
                          px-4
                          py-3
                          text-left
                          text-sm
                          font-medium
													text-gray-900
													dark:text-white
													${
															column.sortable
															? 'cursor-pointer select-none'
															: ''
													}
                        "
                      >
                        ${t(column.label)}
												${
															column.sortable

															?

															`
																	<span
																			class="ml-1"
																			data-sort-icon="${column.key}"
																	>
																			↕
																	</span>
															`

															:

															''

													}
                      </th>
                    `
                  )
                  .join('')
              }
            </tr>
          </thead>
					<tbody>
					</tbody>

        </table>

      </div>

    </div>
  `;

	// add export csv listener
	const exportButton =
		card.querySelector(
			'[data-export-csv]'
		);

	exportButton?.addEventListener(
		'click',
		() =>
			exportCsv(
				table.exportFilename ??
				table.title,
				table.columns,
				table.rows
			)
	);
	container.appendChild(card);
	card
	.querySelectorAll(
			'[data-key]'
	)
	.forEach(th=>{

			th.addEventListener(

					'click',

					()=>{

							const key =
									(
											th as HTMLElement
									).dataset.key!;
								
							let next:
								| 'asc'
								| 'desc'
								| null;

							if ( activeSortColumn !== key ) {

										// Nueva columna:
										// empieza en ASC

										next = 'asc';

								} else {

										// Misma columna:
										// ciclo ASC -> DESC -> NONE

										next =

												activeSortDirection === null

														? 'asc'

														: activeSortDirection === 'asc'

																? 'desc'

																: null;

							}

							if (next === null) {

									activeSortColumn = null;

									activeSortDirection = null;

							} else {

									activeSortColumn = key;

									activeSortDirection = next;

							}

							card
							.querySelectorAll(
									'[data-sort-icon]'
							)
							.forEach(icon => {

									const element =
											icon as HTMLElement;

									const column =

											element.dataset.sortIcon!;

									const direction =

											activeSortColumn === column

											? activeSortDirection

											: null;

									element.textContent =

											direction === 'asc'

													? '▲'

													: direction === 'desc'

															? '▼'

															: '↕';

							});

							sortAnalyticsTable(
									key,
									next
							);

					}

			);

	});

	card
    .querySelectorAll(
        '[data-sort-icon]'
    )
    .forEach(icon => {

        const k =
        (
            icon as HTMLElement
        ).dataset.sortIcon!;

        const isActive =
        activeSortColumn === k;

        icon.textContent =
        isActive &&
        activeSortDirection === 'asc'

            ? '▲'

            : isActive &&
            activeSortDirection === 'desc'

            ? '▼'

            : '↕';

    });
}

export function renderTableRows(
    table: DashboardTable
){

    const tbody =

        document.querySelector(

            `#table-${table.id} tbody`

        );

    if(!tbody){
        return;
    }

    tbody.innerHTML =

        !table.rows.length

            ?

            `
                <tr>

                    <td
                        colspan="${table.columns.length}"
                        class="p-6 text-center"
                    >

                        ${
                            table.emptyMessage ??

                            t('common.no_data_available')
                        }

                    </td>

                </tr>
            `

            :

            table.rows

                .map(

                    row=>`

                        <tr>

                            ${

                                table.columns

                                    .map(

                                        column=>`

                                            <td
                                            class="
                                                px-4
                                                py-3
                                                text-gray-900
                                                dark:text-white
                                            ">

                                                ${

                                                    row[column.key]

                                                    ??

                                                    ''

                                                }

                                            </td>

                                        `

                                    )

                                    .join('')

                            }

                        </tr>

                    `

                )

                .join('');

}

export function renderTable(
    el:HTMLElement,
    table:DashboardTable
){

    renderTableContainer(
        el,
        table
    );

    renderTableRows(
        table
    );

}

export function updateTableRows(
    tableId: string,
    rows: any[]
) {

    const panel =
        document.querySelector(
            `[data-table-id="${tableId}"]`
        );

    if (!panel) {
        return;
    }

    const tbody =
        panel.querySelector('tbody');

    if (!tbody) {
        return;
    }

    const columns =
        Array.from(
            panel.querySelectorAll('thead th')
        ).map(
            th =>
                (th as HTMLElement)
                    .dataset
                    .key
        );

    if (!rows.length) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="${columns.length}"
                    class="p-6 text-center"
                >
                    ${t('common.no_data_available')}
                </td>
            </tr>
        `;

        return;
    }

    tbody.innerHTML =
        rows.map(row => `
            <tr>
                ${
                    columns.map(key => `
                        <td
                            class="
                                px-4
                                py-3
                                text-gray-900
                                dark:text-white
                            "
                        >
                            ${row[key ?? ''] ?? ''}
                        </td>
                    `).join('')
                }
            </tr>
        `).join('');

}

export function registerAnalyticsTableEvents(
    el: HTMLElement,
    tables: DashboardTable[],
    module: any
){

    if (analyticsTableListener) {
        return;
    }

    analyticsTableListener = true;

    window.addEventListener(

        'analytics:table',

        (e:any)=>{

            const detail = e.detail;

            const table = tables.find(

                t =>

                    t.trigger?.chart === detail.chart

                    &&

                    t.trigger?.value === detail.value

            );

            if(!table){
                return;
            }

            setActiveTable(
                table.id
            );

            showTable(
                    el,
                    table.id
            );

            updateTableRows(
                    table.id,
                    detail.rows
            );

        }

    );

}

let analyticsSortListener = false;

export function registerAnalyticsSortEvents(
    module: any
){

    if (analyticsSortListener) {
        return;
    }

    analyticsSortListener = true;

    window.addEventListener(

        'analytics:sort',

        (e: any) => {

            const {
                column,
                direction
            } = e.detail;

            const state =
                module.getState();

            const filters = {
                ...(state.filters ?? {})
            };

            if (direction) {

                filters.sort_by =
                    column;

                filters.sort_direction =
                    direction;

            } else {

                delete filters.sort_by;

                delete filters.sort_direction;

            }console.log('module load',state);

            module.load(
                filters,
                {
                    activeAnalyticsId:
                        state.activeAnalyticsId,

                    activeAnalyticsValue:
                        state.activeAnalyticsValue
                }
            );

        }

    );

}
