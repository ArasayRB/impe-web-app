// src/lib/analytics/renderDashboard.ts
import { renderFilters } from './renderFilters';
import { renderCards } from './renderCards';
import { renderLineChart } from './renderLineChart';
import { renderBarChart } from './renderBarChart';
import { renderPieChart } from './renderPieChart';
import { renderTable, registerAnalyticsTableEvents, updateTableRows, registerAnalyticsSortEvents } from './renderTable';
import { destroyAllCharts } from './chartRegistry';
import { showTable } from './tableController';
import { renderAnalyticsTabs } from './renderAnalyticsTabs';
import { renderAnalyticsOptions } from './renderAnalyticsOptions';
import type { DashboardData } from './types';

let analyticsSelectionListener =
    false;


export function renderDashboard(
  el: HTMLElement,
  module: any,
  dashboard: DashboardData
) {


  if (dashboard.filters) {
    renderFilters(
      el,
      dashboard.filters,
      filters => module.load(filters)
    );
  }

  renderCards(
    el,
    dashboard.cards,
		module
  );

  // clean chart container
  destroyAllCharts();
  const chartsContainer =
    el.querySelector('[data-charts]');

  if (chartsContainer) {
      chartsContainer.innerHTML = '';
  }

    const state =
        module.getState();

    const analyticsTabs =
        dashboard.analyticsTabs ?? [];

    const activeAnalyticsId =
        state.activeAnalyticsId
        ??
        analyticsTabs[0]?.id
        ??
        null;

    const activeAnalyticsHasTable =
    dashboard.tables?.some(
        table =>
            table.trigger?.chart ===
            activeAnalyticsId
    ) ?? false;

    const activeAnalyticsValue =
        state.activeAnalyticsValue
        ??
        dashboard.analyticsOptions?.[
            activeAnalyticsId
        ]?.[0]?.value
        ??
        null;

    const chartsPanel =
    el.querySelector(
        '[data-charts-panel]'
    );

    const tablePanel =
        el.querySelector(
            '[data-table-panel]'
        );

    if (
        chartsPanel &&
        tablePanel
    ) {

        if (
            activeAnalyticsHasTable
        ) {

            chartsPanel.classList.remove(
                'xl:col-span-12'
            );

            chartsPanel.classList.add(
                'xl:col-span-5'
            );

            tablePanel.classList.remove(
                'hidden'
            );

            tablePanel.classList.remove(
                'xl:col-span-12'
            );

            tablePanel.classList.add(
                'xl:col-span-7'
            );

        } else {

            chartsPanel.classList.remove(
                'xl:col-span-5'
            );

            chartsPanel.classList.add(
                'xl:col-span-12'
            );

            tablePanel.classList.add(
                'hidden'
            );

        }

    }
    
    if (
        state.activeAnalyticsId === null
    ) {

        module.setUiState({

            activeAnalyticsId,

            activeAnalyticsValue

        });

    }

    if (
        dashboard.analyticsTabs?.length
    ) {

        renderAnalyticsTabs(
            el,
            dashboard.analyticsTabs,
            activeAnalyticsId,
            (analyticsId: string) => {

                const options =
                    dashboard.analyticsOptions?.[
                        analyticsId
                    ] ?? [];

                const firstValue =
                    options.length
                        ? options[0].value
                        : null;

                module.setUiState(
                    {
                        activeAnalyticsId:
                            analyticsId,

                        activeAnalyticsValue:
                            firstValue
                    }
                );

            }
        );

    }

    const currentAnalyticsId =
    module.getState().activeAnalyticsId
    ?? dashboard.analyticsTabs?.[0]?.id
    ?? null;

    const options =
        dashboard.analyticsOptions?.[
            currentAnalyticsId
        ] ?? [];

   

    renderAnalyticsOptions(
        el,
        currentAnalyticsId,
        options,
        module.getState().activeAnalyticsValue,
        (value: string) => {

            module.setUiState({

                activeAnalyticsId:
                    currentAnalyticsId,

                activeAnalyticsValue:
                    value

            });

        }
    );

    const hasInteractiveAnalytics =
    Boolean(
        dashboard.analyticsTabs?.length
    );

    if (hasInteractiveAnalytics) {

        /*
        * CASES ANALYTICS
        *
        * Only one analytics chart is active
        * at a time.
        */

        const activeChart =
        dashboard.charts?.find(
            chart =>
                chart.id ===
                currentAnalyticsId
        );

        if (activeChart) {

            const chartIndex =
                dashboard.charts?.indexOf(
                    activeChart
                ) ?? 0;

            switch (
                activeChart.type
            ) {

                case 'line':

                    renderLineChart(
                        el,
                        activeChart,
                        chartIndex
                    );

                    break;

                case 'bar':

                    renderBarChart(
                        el,
                        activeChart,
                        chartIndex
                    );

                    break;

                case 'pie':

                    const state =
                        module.getState();

                    const activeValue =
                        state.activeAnalyticsId ===
                            activeChart.id
                            ? state.activeAnalyticsValue
                            : null;

                    renderPieChart(
                        el,
                        activeChart,
                        chartIndex,
                        activeValue
                    );

                    break;

            }

        }
    }else{
        /*
        * LEGACY / NON-INTERACTIVE ANALYTICS
        *
        * Example:
        * Customer Analytics.
        *
        * Render every chart simultaneously.
        */

        dashboard.charts?.forEach(
            (chart, index) => {

                switch (
                    chart.type
                ) {

                    case 'line':

                        renderLineChart(
                            el,
                            chart,
                            index
                        );

                        break;

                    case 'bar':

                        renderBarChart(
                            el,
                            chart,
                            index
                        );

                        break;

                    case 'pie':

                        renderPieChart(
                            el,
                            chart,
                            index,
                            null
                        );

                        break;

                }

            }
        );
    }

        /*
        * TABLE RESOLUTION
        *
        * Cases Analytics:
        *   Tables are dynamic and depend on
        *   activeAnalyticsId + activeAnalyticsValue.
        *
        * Customers Analytics:
        *   Tables are static and have no trigger.
        */

        let activeTable = null;

        /*
        * 1. CASES / DYNAMIC TABLES
        *
        * A table with a trigger belongs to an analytics
        * chart/value combination.
        */
        if (
            currentAnalyticsId &&
            state.activeAnalyticsValue
        ) {

            activeTable =
                dashboard.tables?.find(

                    table =>

                        table.trigger?.chart ===
                            currentAnalyticsId

                        &&

                        table.trigger?.value ===
                            state.activeAnalyticsValue

                ) ?? null;

        }


        /*
        * 2. CASES / DEFAULT TABLE
        *
        * If the current analytics has options but no
        * selected value yet, use the first option.
        *
        * Duration is intentionally excluded because
        * duration has no table.
        */
        if (
            !activeTable

            &&

            currentAnalyticsId

            &&

            currentAnalyticsId !== 'duration'

            &&

            dashboard.analyticsOptions?.[
                currentAnalyticsId
            ]?.length
        ) {

            const defaultValue =
                dashboard.analyticsOptions[
                    currentAnalyticsId
                ][0].value;

            activeTable =
                dashboard.tables?.find(

                    table =>

                        table.trigger?.chart ===
                            currentAnalyticsId

                        &&

                        table.trigger?.value ===
                            defaultValue

                ) ?? null;

        }


        /*
        * 3. CUSTOMERS / STATIC TABLE
        *
        * Customers Analytics does not use triggers.
        *
        * If no dynamic table was found, use the first
        * visible static table.
        */
        if (
            !activeTable
            &&
            dashboard.tables?.length
        ) {

            activeTable =
                dashboard.tables.find(

                    table =>
                        !table.hidden
                        &&
                        !table.trigger

                )

                ??

                dashboard.tables.find(

                    table =>
                        !table.hidden

                )

                ??

                dashboard.tables[0];

        }


        /*
        * CLEAN TABLE CONTAINER
        */
        const tableContainer =
            el.querySelector(
                '[data-table]'
            );

        if (tableContainer) {

            tableContainer.innerHTML = '';

        }


        /*
        * RENDER ACTIVE TABLE
        */
        if (activeTable) {

            renderTable(
                el,
                activeTable
            );

            showTable(
                el,
                activeTable.id
            );

            updateTableRows(
                activeTable.id,
                activeTable.rows
            );

        }


        /*
        * REGISTER TABLE INTERACTIONS
        *
        * This is safe for both:
        *
        * - Cases dynamic tables
        * - Customers static tables
        *
        * The event handlers themselves decide
        * whether the table has a supported interaction.
        */
        if (
            dashboard.tables?.length
        ) {

            registerAnalyticsTableEvents(
                el,
                dashboard.tables,
                module
            );

            registerAnalyticsSortEvents(
                module
            );

        }
}
