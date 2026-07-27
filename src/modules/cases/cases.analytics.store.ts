// modules/cases/cases.analytics.store.ts

import { createAnalyticsModule }
  from '@/lib/analytics/createAnalyticsModule';

import {
  getCasesAnalytics
} from './cases.service';

export const casesAnalyticsModule =
  createAnalyticsModule(
    getCasesAnalytics
  );