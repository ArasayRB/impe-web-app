import ApexCharts from 'apexcharts';

import {
  destroyChart,
  registerChart
}
from './chartRegistry';

import { t } from '@/lib/i18n/i18n';

import { getSlot } from './dom';

export function renderBarChart(
  el: HTMLElement,
  chart: any,
  index: number
) {

  const container =
    getSlot(
      el,
      '[data-charts]'//'[data-bar-chart]'
    );

  if (!container) {
    return;
  }

  const chartId =
    `analytics-bar--${(chart.id ?? index)}`;

	// destroy previous chart to avoid duplicated svg charts	
	destroyChart(chartId);

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

	console.log(
  'Creating bar chart',
  chart
);

try {
	const apex =
    new ApexCharts(
      target,
      {
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false
          }
        },

        series: [
          {
            name: t(chart.title),
            data: chart.values
          }
        ],

        xaxis: {
          categories:
            chart.labels
        },
				plotOptions: {
					bar: {
						borderRadius: 4,
						horizontal: false
					}
				},
      }
    );
	
		
	// register the svg chart to be handle each time re render it
	registerChart(
		chartId,
		apex
	);

  apex.render();
} catch (error) {
	 console.error(
    'BAR CHART ERROR',
    error
  );
}

  
}
