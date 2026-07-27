// src/lib/analytics/renderPieChart.ts
import ApexCharts from 'apexcharts';
import { showAnalyticsTable, selectAnalytics } from './chartEvents';

import { registerChart } from './chartRegistry';

import { t } from '@/lib/i18n/i18n';

import { getSlot } from './dom';

function restorePieSelection(
  card: HTMLElement,
  selectedIndex: number
) {

  const paths =
    card.querySelectorAll(
      '.apexcharts-pie-area'
    );

  paths.forEach(
    (path, index) => {

      const element =
        path as SVGElement;

      if (
        index === selectedIndex
      ) {

        element.style.filter =
          'brightness(0.8)';

      } else {

        element.style.filter =
          '';

      }

    }
  );

}

export function renderPieChart(
  el: HTMLElement,
  chart: any,
  index: number,
  activeAnalyticsValue:
    string | null = null
) {

  const container =
    getSlot(
      el,
      '[data-charts]'//'[data-pie-chart]'
    );

  if (!container) {
    return;
  }

  const chartId =
    `analytics-pie--${index}`;

	
  const card =
    document.createElement('div');
    
  card.innerHTML = `
    <div
      class="
        p-4
        bg-white
        border
        border-gray-200
        rounded-lg
        shadow-sm
        dark:bg-gray-800
        dark:border-gray-700
      "
    >

      <h3
				data-i18n="${t(chart.title)}"
        class="
          mb-4
          text-lg
          font-semibold
          text-gray-900
          dark:text-white
        "
      >
        ${t(chart.title)}
      </h3>

      <div id="${chartId}"></div>

    </div>
  `;
  
  container.appendChild(card);

  const target =
    card.querySelector(
    `#${chartId}`
  );

  if (!target) {
    return;
  }

  const datasetKeys =
    chart.datasets
        ? Object.keys(
            chart.datasets
        )
        : [];

  const selectedIndex =
      activeAnalyticsValue !== null
          ? datasetKeys.indexOf(
              activeAnalyticsValue
          )
          : -1;

  const apex =
    new ApexCharts(
      target,
      {
        chart: {
          type: 'donut',
          height: 350,
					events:{

						dataPointSelection(
                event,
                chartContext,
                config
            ){

                /*
                * Static pie chart.
                *
                * Example:
                * Customers distribution.
                *
                * No datasets means there is no
                * analytics selection or table
                * associated with the donut.
                */
                if (!chart.datasets) {

                    return;

                }


                /*
                * Interactive pie chart.
                *
                * Example:
                * Cases workflow / deadline / health.
                */
                const datasetKeys =
                    Object.keys(
                        chart.datasets
                    );

                const key =
                    datasetKeys[
                        config.dataPointIndex
                    ];

                if (!key) {

                    return;

                }

                showAnalyticsTable(
                    chart.id,
                    key,
                    chart.datasets[key] ?? []
                );

                requestAnimationFrame(
                    () => {

                        selectAnalytics(
                            chart.id,
                            key
                        );

                    }
                );

            }

					}
        },

        series: chart.values,

      	labels: chart.labels,

         legend: {
					position: 'bottom'
				}
      }
    );
	
		
	// register the svg chart to be handle each time re render it
	registerChart(
		chartId,
		apex
	);

  apex.render();

  if (
      activeAnalyticsValue !== null
      &&
      chart.datasets
  ) {

      const datasetKeys =
          Object.keys(
              chart.datasets
          );

      const selectedIndex =
          datasetKeys.indexOf(
              activeAnalyticsValue
          );

      if (
          selectedIndex !== -1
      ) {

          requestAnimationFrame(
              () => {

                  restorePieSelection(
                      card,
                      selectedIndex
                  );

              }
          );

      }

  }
}
