import {
  getSlot
} from './dom';

import { t } from '@/lib/i18n/i18n';
import { resolveTranslation } from '@/lib/i18n/resolveTranslations';

export function renderFilters(
  el: HTMLElement,
  filters: any,
  onChange: (
    filters: any
  ) => void
) {

  const container =
    getSlot(
        el,
      '[data-filters]'
    );console.log('filters container',container)

  container.innerHTML = `
    <div
      class="
      flex
      gap-4
      mb-6
      items-end
      "
    >
      <div>
        <label
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          data-i18n="common.analytics.filter_date_start"
        >
          ${t('common.analytics.filter_date_start')}
        </label>

        <input
          type="date"
          data-start-date
          class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          value="${filters.start_date || ''}"
        />
      </div>

      <div>
        <label
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          data-i18n="common.analytics.filter_date_end"
        >          
          ${t('common.analytics.filter_date_end')}
        </label>

        <input
          type="date"
          data-end-date
          class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          value="${filters.end_date || ''}"
        />
      </div>

      <div>
        <label
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          data-i18n="common.analytics.filter_group_by"
        >
          ${t('common.analytics.filter_group_by')}
        </label>
        <select
          data-group-by
          class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        >

          ${
            filters.available_groups
              ?.map(
                group => `
                  <option
                    value="${group}"
                    data-i18n="common.analytics.group_${group}"
                    ${
                      group === filters.group_by
                        ? 'selected'
                        : ''
                    }
                  >
                    ${t(`common.analytics.group_${group}`)}
                  </option>
                `
              )
              .join('')
          }

        </select>
      </div>

			${
						filters.case_types?.length
								? `
										<div>
											<label
												class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
												data-i18n="common.analytics.filter_case_type"
											>
												${t(
													'common.analytics.filter_case_type'
												)}
											</label>

											<select
												data-case-type-id
												class="
													bg-gray-50
													border
													border-gray-300
													text-gray-900
													sm:text-sm
													rounded-lg
													focus:ring-primary-500
													focus:border-primary-500
													block
													w-full
													p-2.5
													dark:bg-gray-700
													dark:border-gray-600
													dark:text-white
												"
											>

												<option value="">
													${t(
														'common.analytics.case_type_all'
													)}
												</option>

												${
													filters.case_types
														.map(
															caseType => `
																<option
																	value="${caseType.id}"
																	${
																		String(
																			caseType.id
																		) ===
																		String(
																			filters.case_type_id
																		)
																			? 'selected'
																			: ''
																	}
																>
																	${caseType.name}
																</option>
															`
														)
														.join('')
												}

											</select>
										</div>
									`
								: ''
				}

      <div>
        <button
          data-apply-filters
          class="
            px-4
            py-2
            text-white
            bg-primary-600
            rounded-lg
          "
          data-i18n="common.analytics.filter_btn"
        >
          ${t('common.analytics.filter_btn')}
        </button>
      </div>

    </div>
  `;

  const startInput =
    container.querySelector(
      '[data-start-date]'
    );

  const endInput =
    container.querySelector(
      '[data-end-date]'
    );

  const select =
    container.querySelector(
      '[data-group-by]'
    );

	const caseTypeSelect =
  container.querySelector(
    '[data-case-type-id]'
  ) as HTMLSelectElement | null;

  container
  .querySelector(
    '[data-apply-filters]'
  )
  ?.addEventListener(
    'click',
    () => {

      const startDate =
        startInput.value;

      const endDate =
        endInput.value;

      const groupBy =
        select.value;

      onChange({
        start_date: startDate,
        end_date: endDate,
        group_by: groupBy,
				...(caseTypeSelect
						? {
								case_type_id:
										caseTypeSelect.value
												|| null
						}
						: {}
				)
      });
    }
  );
}
