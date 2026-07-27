import type { DashboardData } from '@/lib/analytics/types';
import { t } from '@/lib/i18n/i18n';

export function mapCasesAnalytics(
  analytics: any
): DashboardData {

  return {

	analyticsTabs: [
		{
			id: 'workflow',
			label: 'cases.analytics.workflow'
		},
		{
			id: 'deadline',
			label: 'cases.analytics.deadline'
		},
		{
			id: 'health',
			label: 'cases.analytics.health.title'
		},
		{
			id: 'duration',
			label: 'cases.analytics.duration'
		}
	],

	analyticsOptions: {

		workflow: [
			{
				value: 'active',
				label: 'cases.analytics.workflow_active'
			},
			{
				value: 'paused',
				label: 'cases.analytics.workflow_paused'
			},
			{
				value: 'completed',
				label: 'cases.analytics.workflow_completed'
			}
		],

		deadline: [
			{
				value: 'ok',
				label: 'cases.analytics.ok'
			},
			{
				value: 'warning',
				label: 'cases.analytics.warning'
			},
			{
				value: 'overdue',
				label: 'cases.analytics.overdue'
			}
		],

		health: [
			{
				value: 'create_child_case',
				label: 'cases.analytics.create_child_case'
			},
			{
				value: 'continue',
				label: 'cases.analytics.continue'
			}
		],

		duration: []

	},

		cards: analytics.cards.map((card: any) => {

			const cardConfig: Record<
				string,
				{
					analyticsId?: string;
					analyticsValue?: string;
				}
			> = {

				active_cases: {
					analyticsId: 'workflow',
					analyticsValue: 'active'
				},

				overdue_cases: {
					analyticsId: 'deadline',
					analyticsValue: 'overdue'
				},

				average_process_duration: {
					analyticsId: 'duration'
				}

			};

			const interaction =
				cardConfig[card.key] ?? {};

			return {

				title:
					`cases.analytics.${card.key}`,

				value:
					card.suffix
						? `${card.value}${card.suffix}`
						: card.value,

				icon:
					card.icon,

				color:
					card.color,

				showTrend:
					false,

				analyticsId:
					interaction.analyticsId ?? null,

				analyticsValue:
					interaction.analyticsValue ?? null

			};

		}),

    charts: [
        {
			id:'workflow',

			type:'pie',

			title: 'cases.analytics.workflow',

			labels: [

				t('cases.analytics.active'),

				t('cases.analytics.completed'),

				t('cases.analytics.paused')

			],

			values: [

				analytics.workflow.active,

				analytics.workflow.completed,

				analytics.workflow.paused

			],					

			datasets:{
					active: analytics.workflow.datasets.active,
					completed: analytics.workflow.datasets.completed,
					paused: analytics.workflow.datasets.paused
			}

		},

		{
			id:'deadline',

			type:'pie',

			title: 'cases.analytics.deadline',

			labels: [

				t('cases.analytics.ok'),

				t('cases.analytics.warning'),

				t('cases.analytics.overdue')

			],

			values: [

				analytics.deadline.ok,

				analytics.deadline.warning,

				analytics.deadline.overdue

			],					

						datasets:{
								ok: analytics.deadline.datasets.ok,
								warning: analytics.deadline.datasets.warning,
								overdue: analytics.deadline.datasets.overdue
						}

		},
		{
				id:'health',

				type:'pie',

				title:'cases.analytics.health.title',

				labels:Object.keys(
						analytics.health.actions
				).map(
						action => t(`cases.analytics.health.${action}`)
				),

				values:Object.values(
						analytics.health.actions
				),

				datasets: analytics.health.datasets
		},
		{
				id: 'duration_by_case_type',

				type: 'bar',

				title:
						'cases.analytics.workflow_duration.by_case_type',

				labels:
						analytics.workflow.duration.by_case_type
								.map(
										item => item.case_type_name
								),

				values:
						analytics.workflow.duration.by_case_type
								.map(
										item => item.average_days
								),

				datasets:
						analytics.workflow.duration.by_case_type
		},
		{
			id: 'duration',

			type: 'line',

			title:
				'cases.analytics.workflow_duration.title',

			labels:
				analytics.workflow.duration.monthly.map(
				item => item.period
				),

			values:
				analytics.workflow.duration.monthly.map(
				item => item.average_days
				),

			datasets:
				analytics.workflow.duration.monthly

			}
    ],

	tables: [

			//workflow-tables
			{
					id: 'workflow-active',

					title: 'cases.analytics.workflow_active',

					exportButtonTitle: 'common.crud.export',

					trigger: {
							chart: 'workflow',
							value: 'active'
					},

					columns: [

							{
									key: 'case_number',
									label: 'cases.fields.case',
									sortable: true
							},

							{
									key: 'title',
									label: 'cases.fields.title',
									sortable: true
							},

							{
									key: 'status',
									label: 'cases.fields.status'
							},

							{
									key: 'progress',
									label: 'cases.analytics.progress'
							},

							{
									key: 'deadline',
									label: 'cases.analytics.deadline'
							}

					],

					rows: analytics.workflow.datasets.active
			},

			{
					id: 'workflow-paused',

					title: 'cases.analytics.workflow_paused',

					exportButtonTitle: 'common.crud.export',

					trigger: {
							chart: 'workflow',
							value: 'paused'
					},

					columns: [

							{
									key: 'case_number',
									label: 'cases.fields.case',
									sortable: true
							},

							{
									key: 'title',
									label: 'cases.fields.title',
									sortable: true
							},

							{
									key: 'status',
									label: 'cases.fields.status'
							},

							{
									key: 'progress',
									label: 'cases.analytics.progress'
							},

							{
									key: 'deadline',
									label: 'cases.analytics.deadline'
							}

					],

					rows: analytics.workflow.datasets.paused
			},

			{
					id: 'workflow-completed',

					title: 'cases.analytics.workflow_completed',

					exportButtonTitle: 'common.crud.export',

					trigger: {
							chart: 'workflow',
							value: 'completed'
					},

					columns: [

							{
									key: 'case_number',
									label: 'cases.fields.case',
									sortable: true
							},

							{
									key: 'title',
									label: 'cases.fields.title',
									sortable: true
							},

							{
									key: 'status',
									label: 'cases.fields.status'
							},

							{
									key: 'progress',
									label: 'cases.analytics.progress'
							},

							{
									key: 'deadline',
									label: 'cases.analytics.deadline'
							}

					],

					rows: analytics.workflow.datasets.completed
			},

			//deadline-tables
			{
					id: 'deadline-ok',

					title: 'cases.analytics.ok',

					exportButtonTitle: 'common.crud.export',

					trigger: {
							chart: 'deadline',
							value: 'ok'
					},

					columns: [

							{
									key: 'case_number',
									label: 'cases.fields.case',
									sortable: true
							},

							{
									key: 'title',
									label: 'cases.fields.title',
									sortable: true
							},

							{
									key: 'customer',
									label: 'cases.fields.customer'
							},

							{
									key: 'remaining_days',
									label: 'cases.analytics.remaining_days'
							},

							{
									key: 'status',
									label: 'cases.analytics.status'
							}

					],

					rows: analytics.deadline.datasets.ok
			},
			{
					id: 'deadline-warning',

					title: 'cases.analytics.warning',

					exportButtonTitle: 'common.crud.export',

					trigger: {
							chart: 'deadline',
							value: 'warning'
					},

					columns: [

							{
									key: 'case_number',
									label: 'cases.fields.case',
									sortable: true
							},

							{
									key: 'title',
									label: 'cases.fields.title',
									sortable: true
							},

							{
									key: 'customer',
									label: 'cases.fields.customer'
							},

							{
									key: 'remaining_days',
									label: 'cases.analytics.remaining_days'
							},

							{
									key: 'status',
									label: 'cases.analytics.status'
							}

					],

					rows: analytics.deadline.datasets.warning
			},
			{
					id: 'deadline-overdue',

					title: 'cases.analytics.overdue',

					exportButtonTitle: 'common.crud.export',

					trigger: {
							chart: 'deadline',
							value: 'overdue'
					},

					columns: [

							{
									key: 'case_number',
									label: 'cases.fields.case',
									sortable: true
							},

							{
									key: 'title',
									label: 'cases.fields.title',
									sortable: true
							},

							{
									key: 'customer',
									label: 'cases.fields.customer'
							},

							{
									key: 'remaining_days',
									label: 'cases.analytics.remaining_days'
							},

							{
									key: 'status',
									label: 'cases.analytics.status'
							}

					],

					rows: analytics.deadline.datasets.overdue
			},

			//health-tables
			{
					id: 'health-create_child_case',

					title: 'cases.analytics.create_child_case',

					exportButtonTitle: 'common.crud.export',

					trigger: {
							chart: 'health',
							value: 'create_child_case'
					},

					columns: [

							{
									key: 'case_number',
									label: 'cases.fields.case',
									sortable: true
							},

							{
									key: 'title',
									label: 'cases.fields.title',
									sortable: true
							},

							{
									key: 'customer',
									label: 'cases.fields.customer'
							},

							{
									key: 'status',
									label: 'cases.analytics.status'
							}

					],

					rows: analytics.health.datasets.create_child_case
			},
			{
					id: 'health-continue',

					title: 'cases.analytics.continue',

					exportButtonTitle: 'common.crud.export',

					trigger: {
							chart: 'health',
							value: 'continue'
					},

					columns: [

							{
									key: 'case_number',
									label: 'cases.fields.case',
									sortable: true
							},

							{
									key: 'title',
									label: 'cases.fields.title',
									sortable: true
							},

							{
									key: 'customer',
									label: 'cases.fields.customer'
							},

							{
									key: 'status',
									label: 'cases.analytics.status'
							}

					],

					rows: analytics.health.datasets.continue
			}

	],

    filters: {

      ...analytics.filters,

      available_groups:
        analytics.available_groups

    }

  };

}
