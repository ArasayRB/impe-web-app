import {
  mountAnalytics
}
from '@/lib/analytics/createAnalyticsUi';

import {
  customersAnalyticsModule
}
from './customers.analytics.store';

import {
  mapCustomersAnalytics
}
from './customersAnalyticsMapper';

import { initSite } from '@/lib/site.store';

export function mountCustomersAnalytics(
  el: HTMLElement
) {

  const root = document.getElementById('customers-analytics-root');

	if (root?.dataset.site) {
		initSite(JSON.parse(root.dataset.site));
	}

    const initial =
    JSON.parse(
        el.dataset.initial || '{}'
    );

  customersAnalyticsModule
    .hydrate(initial);


    mountAnalytics({

        el,

        module:
        customersAnalyticsModule,

        mapper:
        mapCustomersAnalytics
    });
}