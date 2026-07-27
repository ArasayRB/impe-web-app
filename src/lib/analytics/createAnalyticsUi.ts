import type {DashboardData} from './types';

import { renderDashboard } from './renderDashboard';

import {renderError} from './renderError';

import { createViewEngine } from '@/lib/createViewEngineUi';

import { waitForI18n } from '@/lib/i18n/i18n';

import {
  registerAnalyticsSelection
} from './analyticsEvents';


type Config = {

  el: HTMLElement;

  module: any;

  mapper: (
    analytics: any
  ) => DashboardData;
};

export async function mountAnalytics(
  config: Config
) {

  const {
    el,
    module,
    mapper
  } = config;

  await waitForI18n();

  registerAnalyticsSelection(
    module
  );
 

  // unify render module and i18nVersion.subscribe
  createViewEngine({
    module,

    segments: {
      state: () => {

        const state = module.getState();

        if (state.error) {
          renderError(
            el,
            state.error
          );

          return;
        }

        if (!state.data) return;

        const dashboard =
        mapper(state.data);

        renderDashboard(
          el,
          module,
          dashboard
        );
      }
    }
  });

  if (!module.getState().data) {
    await module.load();
  }
}
