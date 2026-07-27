// modules/customers/customers.analytics.store.ts

import { createAnalyticsModule }
  from '@/lib/analytics/createAnalyticsModule';

import {
  getCustomersAnalytics
} from './customers.service';

export const customersAnalyticsModule =
  createAnalyticsModule(
    getCustomersAnalytics
  );