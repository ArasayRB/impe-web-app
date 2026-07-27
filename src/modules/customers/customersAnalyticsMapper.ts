// src/modules/customers/customersAnalyticsMapper.ts
import type {
  DashboardData
} from '@/lib/analytics/types';

import { mapTimeline } from '@/lib/analytics/map.timeline';
import { t } from '@/lib/i18n/i18n';

export function mapCustomersAnalytics(
  analytics: any
): DashboardData {

  return {

    cards: [

      {
        title: 'customers.analytics.total',
        value:
          analytics.summary.total_customers,
        icon: 'users',
				showTrend: false
      },

      {
        title: 'customers.analytics.new',
        value:
          analytics.summary.new_customers,

        percent:
          analytics.growth.percentage,

        trend:
          analytics.growth.trend,

        description:
          `${analytics.growth.current_period}
          vs
          ${analytics.growth.previous_period}`,
        
        icon: 'user-plus',

				showTrend: true
      },

      {
        title: 'customers.analytics.with_cases',
        value:
          analytics.summary.customers_with_cases,
        icon: 'folder-users',
				showTrend: false
      },

      {
        title: 'customers.analytics.without_cases',
        value:
          analytics.summary.customers_without_cases,
        icon: 'user-minus',
				showTrend: false
      },

      {
        title: 'customers.analytics.total_cases',
        value:
          analytics.cases.total_cases,
        icon: 'briefcase',
				showTrend: false
      },

      {
        title: 'customers.analytics.avge_cases',
        value:
          analytics.cases.avg_cases_per_customer,
        icon: 'bar-chart',
				showTrend: false
      }
    ],
    charts: [

        {

            type:'line',

            title:'customers.analytics.customers_growth',

            ...mapTimeline(
                analytics.timeline,
                'customers',
                analytics.filters.group_by
            )

        },

        {

            type:'bar',

            title:'customers.analytics.customers_by_period',

            ...mapTimeline(
                analytics.timeline,
                'customers',
                analytics.filters.group_by
            )

        },

        {

            type:'pie',

            title:'customers.analytics.customers_distribution',

            labels:[
                t('customers.analytics.with_cases'),
                t('customers.analytics.without_cases')
            ],

            values:[
                analytics.summary.customers_with_cases,
                analytics.summary.customers_without_cases
            ]

        }

    ],

    tables: [
			{
				id:'customers_top',

				title: 'customers.analytics.customers_top',

				exportable: true,

				exportFilename: 'customers-analytics',

				exportButtonTitle: 'common.crud.export',

				columns: [
					{
						key: 'name',
						label: 'sidebar.dashboard.customers',
						sortable:true
					},
					{
						key: 'cases',
						label: 'sidebar.dashboard.cases'
					}
				],

				rows:
					analytics.top_customers
			}
		],

    filters:{
      ...analytics.filters,

      available_groups:
        analytics.available_groups
    }
  };
}
