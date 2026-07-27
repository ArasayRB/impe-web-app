import type {
  DashboardCard
} from './types';

import {
  getSlot
} from './dom';

import {
  cardIcons
} from './cardIcons';

import { t } from '@/lib/i18n/i18n';
import { resolveTranslation } from '@/lib/i18n/resolveTranslations';

function isInteractiveCard(
    card: DashboardCard
): boolean {

    return Boolean(
        card.analyticsId
    );

}
export function renderCards(
  el: HTMLElement,
  cards: DashboardCard[],
	module: any
) {

    const container =
    getSlot(
        el,
        '[data-cards]'
    );
    const trendSvg = {

        up: `
        <svg
            class="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
        >
            <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
            />
        </svg>
        `,

        down: `
        <svg
            class="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
        >
            <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
            />
        </svg>
        `,

        stable: `
        <svg
            class="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
        >
            <path
            d="M4 10h12"
            stroke="currentColor"
            stroke-width="2"
            />
        </svg>
        `
    };

  container.innerHTML =`<div
            class="grid w-full grid-cols-1 gap-4 mt-4 xl:grid-cols-2 2xl:grid-cols-3"
        >
                `+
                    cards
                    .map(card => {

											const colorMap = {

													primary: {
															bg: 'bg-blue-100 dark:bg-blue-900',
															text: 'text-blue-600 dark:text-blue-300'
													},

													success: {
															bg: 'bg-green-100 dark:bg-green-900',
															text: 'text-green-600 dark:text-green-300'
													},

													danger: {
															bg: 'bg-red-100 dark:bg-red-900',
															text: 'text-red-600 dark:text-red-300'
													},

													warning: {
															bg: 'bg-yellow-100 dark:bg-yellow-900',
															text: 'text-yellow-600 dark:text-yellow-300'
													},

													info: {
															bg: 'bg-cyan-100 dark:bg-cyan-900',
															text: 'text-cyan-600 dark:text-cyan-300'
													}

											};

										const style =
												colorMap[card.color ?? 'primary'];
                        const trendColor =
                            card.trend === 'up'
                                ? 'text-green-500 dark:text-green-400'
                                : card.trend === 'down'
                                ? 'text-red-500 dark:text-red-400'
                                : 'text-gray-500 dark:text-gray-400';
                        return `
                        
                        <div
														class="
																shrink-0
																items-center
																justify-between
																p-4
																rounded-lg
																border
																shadow-sm
																bg-white
																dark:bg-gray-800
																dark:border-gray-700
																${
																		card.analyticsId
																				? 'cursor-pointer transition hover:shadow-md hover:-translate-y-0.5'
																				: ''
																}
														"
														${
																card.analyticsId
																		? `
																				data-analytics-card
																				data-analytics-id="${card.analyticsId}"
																				${
																						card.analyticsValue
																								? `data-analytics-value="${card.analyticsValue}"`
																								: ''
																				}
																		`
																		: ''
														}
												> 
                            <div class="w-full"> 
                                <h3 class="text-base font-normal text-gray-500 dark:text-gray-400"
                                data-i18n="${t(card.title)}"
                                >
                                ${t(card.title)}
                                </h3> 
																<div class="mt-3 mb-3 inline-flex items-center justify-center w-10 h-10 rounded-lg ${style.bg} ${style.text} " data-card-icon > </div>
                                ${
                                    card.description
                                    ? `
                                        <p class="mt-2 text-xs text-gray-900 dark:text-white">
                                        ${card.description}
                                        </p>
                                    `
                                    : ''
                                }
                                <span class="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
                                ${card.value}
                                </span> 
																${
																	isInteractiveCard(card)
																			? `
																					<span
																							class="
																									mt-2
																									block
																									text-xs
																									text-gray-400
																									dark:text-gray-500
																							"
																					>
																							${t('common.analytics.view_details')}
																					</span>
																			`
																			: ''
															}
                                ${
																			card.showTrend
																			? `
																					<p class="flex items-center text-base font-normal text-gray-500 dark:text-gray-400">

																							<span class="flex items-center mr-1.5 text-sm ${trendColor}">
																									${
																											card.trend === 'up'
																													? trendSvg.up
																													: card.trend === 'down'
																															? trendSvg.down
																															: trendSvg.stable
																									}

																									${card.percent ?? 0}%
																							</span>

																							<span
																									data-i18n="${
																											card.trend !== 'up' && card.trend !== 'down'
																													? 'common.analytics.trend_nc'
																													: 'common.analytics.trend_' + card.trend
																									}"
																							>
																									${
																											card.trend === 'up'
																													? t('common.analytics.trend_up')
																													: card.trend === 'down'
																															? t('common.analytics.trend_down')
																															: t('common.analytics.trend_nc')
																									}
																							</span>

																					</p>
																			`
																			: ''
																	}
                            </div> 
                        </div> 
                    `;
                    })
                    .join('')+`

            
        </div>`;

container
.querySelectorAll('[data-card-icon]')
.forEach((icon,index)=>{

    icon.innerHTML =
        cardIcons(
            cards[index].icon
        ) ?? '';

});

container
.querySelectorAll(
    '[data-analytics-card]'
)
.forEach(cardElement => {

    cardElement.addEventListener(
        'click',
        () => {

            const card =
                cardElement as HTMLElement;

            const analyticsId =
                card.dataset.analyticsId;

            const analyticsValue =
                card.dataset.analyticsValue
                ?? null;

            if (!analyticsId) {
                return;
            }

            module.setUiState({

                activeAnalyticsId:
                    analyticsId,

                activeAnalyticsValue:
                    analyticsValue

            });

        }
    );

});
}
