// src/lib/analytics/types.ts
export interface DashboardCard {
  title: string;
  value: string | number;
  percent?: number;
  trend?: 'up' | 'down' | 'stable';
  description?: string;
	showTrend?: boolean;
	icon?: string;
	color?: string;
	analyticsId?: string | null;
  analyticsValue?: string | null;
}

export interface DashboardChartData {
	id?: string;
	
  title: string;

  type?: 'line' | 'bar' | 'pie';

  labels: string[];

  values: number[];

  datasets?: Record<
    string,
    DashboardTable
  >;
}

export interface DashboardPieData {
	id?: string;

  title: string;  

  labels: string[];

  values: number[];

  datasets?: Record<
    string,
    DashboardTable
  >;
}

export interface DashboardTable {

	id: string;

  title: string;

  columns: DashboardTableColumn[];

  rows: Record<string, any>[];

  emptyMessage?: string;

	exportable?: boolean;

  exportFilename?: string;

  exportButtonTitle: string;

  hidden?: boolean;

	trigger?:{

			chart:string;

			value:string;

	}

}

export interface DashboardTableColumn {

  key: string;

  label: string;

	sortable?: boolean;

	sortKey?: string;
}

export interface DashboardFilters {
  start_date: string;
  end_date: string;
  group_by: string;
  available_groups: string[];
	sort_by?: string;
	sort_direction?:
			| 'asc'
			| 'desc';
}

export interface ActivityItem {

  id?: string | number;

  title: string;

  description?: string;

  date: string;

  type?:
    | 'customer'
    | 'case'
    | 'document'
    | 'system';

  url?: string;
}

export interface Insight {

  title: string;

  description: string;

  severity?:
    | 'info'
    | 'warning'
    | 'success'
    | 'danger';

  icon?: string;
}

export interface SmartChatConfig {

  enabled: boolean;

  title?: string;

  placeholder?: string;

  provider?: string;

  context?: Record<string, any>;
}

export interface DashboardTab {

  key: string;

  label: string;

  url: string;

  active?: boolean;
}

export interface DashboardChart {
		id?: string;

    type: 'line' | 'bar' | 'pie';

    title: string;

    labels: string[];

    values: number[];

		datasets?: Record<
			string,
			DashboardTable
		>;

}

export interface DashboardData {

	tabs?: DashboardTab[];

  filters?: DashboardFilters;

  analyticsTabs?: {
      id: string;
      label: string;
  }[];

  analyticsOptions?: Record<
      string,
      {
          value: string;
          label: string;
      }[]
  >;

  cards: DashboardCard[];

  charts?: DashboardChart[];

  tables?: DashboardTable[];	

	activityFeed?: ActivityItem[];

	insights?: Insight[];

	smartChat?: SmartChatConfig;
}
