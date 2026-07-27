//lib/analytics/createAnalyticsModule.ts
type State = {
  loading: boolean;
  error: any;
  data: any;  
  filters: Record<string, any>;
  activeAnalyticsId:
    string | null;

  activeAnalyticsValue:
    string | null;
};

export function createAnalyticsModule(
  fetcher: (
    filters?: Record<string, any>
  ) => Promise<any>,
  initialFilters: Record<string, any> = {}
) {
  const state: State = {
    loading: false,
    error: null,
    data: null,    
    filters: {
      ...initialFilters
    },
    activeAnalyticsId:
        null as string | null,

    activeAnalyticsValue:
        null as string | null
  };

  const listeners = new Set<Function>();

  function notify() {
    listeners.forEach(fn => fn(state));
  }

  return {

    hydrate(data: any) {

      state.data = data;

      if (data?.filters) {

        state.filters = {

          ...state.filters,

          ...data.filters

        };

      }

      notify();

    },

    getState() {
      return state;
    },

    subscribe(fn: Function) {
      listeners.add(fn);

      return () => listeners.delete(fn);
    },

    async load(
      filters?: Record<string, any>,
      uiState: {
        activeAnalyticsId?: string | null;  //define were analytics context user is working
        activeAnalyticsValue?: string | null;
      } = {}
    ) {

        if (filters) {

          state.filters = {
            ...state.filters,
            ...filters
          };

        }

        if (
          uiState.activeAnalyticsId !== undefined
        ) {

          state.activeAnalyticsId =
            uiState.activeAnalyticsId;

        }

        if (
          uiState.activeAnalyticsValue !== undefined
      ) {

          state.activeAnalyticsValue =
              uiState.activeAnalyticsValue;

      }

        try {

          state.loading = true;

          const response =
            await fetcher(
              state.filters
            );

          state.data =
            response.data;

          state.error =
            null;

        } catch (e) {

          state.error =
            e;

        } finally {

          state.loading =
            false;

          notify();

        }

    },

    setUiState(
        uiState: {
            activeAnalyticsId?:
                string | null;

            activeAnalyticsValue?:
                string | null;
        }
    ) {

        let changed = false;

        if (
            uiState.activeAnalyticsId !== undefined
            &&
            state.activeAnalyticsId !==
                uiState.activeAnalyticsId
        ) {

            state.activeAnalyticsId =
                uiState.activeAnalyticsId;

            changed = true;

        }

        if (
            uiState.activeAnalyticsValue !== undefined
            &&
            state.activeAnalyticsValue !==
                uiState.activeAnalyticsValue
        ) {

            state.activeAnalyticsValue =
                uiState.activeAnalyticsValue;

            changed = true;

        }

        if (changed) {

            notify();

        }

    }
  };
}