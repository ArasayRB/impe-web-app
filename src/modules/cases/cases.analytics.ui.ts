import {
  mountAnalytics
}
from '@/lib/analytics/createAnalyticsUi';

import {
  casesAnalyticsModule
}
from './cases.analytics.store';

import {
  mapCasesAnalytics
}
from './casesAnalyticsMapper';

import { initSite } from '@/lib/site.store';

export function mountCasesAnalytics(
  el: HTMLElement
) {

  const root = document.getElementById('cases-analytics-root');

	if (root?.dataset.site) {
		initSite(JSON.parse(root.dataset.site));
	}

    const initial =
    JSON.parse(
        el.dataset.initial || '{}'
    );

  casesAnalyticsModule
    .hydrate(initial);


    mountAnalytics({

        el,

        module:
        casesAnalyticsModule,

        mapper:
        mapCasesAnalytics
    });
}