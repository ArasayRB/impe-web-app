// src/lib/createcrudModule
import type { DefinitionSection } from "@/lib/definitions/types";

type CrudError = {
  message: string;
  code: string;
};

type CrudMeta = {
  current_page: number;
  last_page: number;
  total?: number;
};

type CrudState<T> = {
  data: T[];
  meta: CrudMeta;
  error: CrudError | null;
  loading: boolean;
};

export function createCrudModule<T>(config: {
  name: string;
  fetcher: (params?: any) => Promise<any>;
  search?: (text: string, signal?: AbortSignal) => Promise<any>;
  create?: (data: any) => Promise<any>;
  import?: (data: any) => Promise<any>;
  bulk_remove?: (data: any) => Promise<any>;
  update?: (id: string | number, data: any) => Promise<any>;
  remove?: (id: string | number) => Promise<any>;
  tagSelector?:{

      map(item:any):{

          id:number;

          label:string;

      };
      create?:(text:string)=>Promise<any>;

  };
  definitionSchema?: DefinitionSection[];
  normalizer: (apiResponse: any) => {
    data: T[];
		meta: CrudMeta;
		error: CrudError | null;
  };
}) {
  let state: CrudState<T> = {
		data: [],
		meta: {
			current_page: 1,
			last_page: 1,
			total: 0,
		},
		error: null,
		loading: false,
	};

  const tagSelector = config.tagSelector && {

      map: config.tagSelector.map,

      search: async(text:string)=>{

          const res = await search(text);

          return res.data.data.map(

              config.tagSelector!.map

          );

      },

      create: config.tagSelector.create

  };

  const definitionSchema = config.definitionSchema;

  const listeners = new Set<(state: CrudState<T>) => void>();

  function notify() {
    listeners.forEach((fn) => fn(state));
  }

  let lastParams: any = {};
  async function fetch(params?: any) {
    if (params) {
      lastParams = params;
    }
    state = { ...state, loading: true, error: null };
    notify();
    try {
      const res = await config.fetcher(lastParams);

      const normalized = config.normalizer(res);console.log('after fetch in CRUD MODULE',normalized);

      state = {
        ...state,
        ...normalized,
        loading: false,
      };

    } catch (e: unknown) {console.log('ERROR after fetch in CRUD MODULE',e,lastParams);
      const err = e as { message?: string; code?: string };

			state = {
				...state,
				error: {
					message: err.message || 'Unexpected error',
					code: err.code || 'UNKNOWN',
				},
				loading: false,
			};
    }
      notify();
  }

  let searchController: AbortController | null = null;

  async function search(text: string) {

      if (!config.search) {

          throw new Error(

              `${config.name} does not implement search()`

          );

      }

      searchController?.abort();

      searchController = new AbortController();

      return config.search(

          text,

          searchController.signal

      );

  }

	async function bulkRemove(data: any) {
    if (!config.bulk_remove) return;

    const res = await config.bulk_remove?.(data);
    if (!res) {
      throw new Error('Bulk remove returned empty response');
    }
    await fetch(lastParams); // refresh automático
    return res; // 🔥 ESTO FALTABA
  }

	async function bulkImport(data: any) {
    if (!config.import) return;

    const res = await config.import?.(data);
    if (!res) {
      throw new Error('Import returned empty response');
    }
    await fetch(lastParams); // refresh automático
    return res; // 🔥 ESTO FALTABA
  }

	async function createItem(data: any) {
    if (!config.create) return;

    const res = await config.create?.(data);
    if (!res) {
      throw new Error('Create returned empty response');
    }
    await fetch(lastParams); // refresh automático
    return res; // 🔥 ESTO FALTABA
  }

  async function updateItem(id: any, data: any) {
    if (!config.update) return;

    await config.update(id, data);
    await fetch(lastParams);
  }

  async function deleteItem(id: any) {
    if (!config.remove) return;

    await config.remove(id);
    await fetch(lastParams);
  }

  function hydrate(initialData: any) {
    const normalized = config.normalizer(initialData);

    state = {
      ...state,
      ...normalized,
    };
  }

  function subscribe(fn: (state: CrudState<T>) => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }


  function getState() {
    return state;
  }

  return {
    fetch,
    search,
    hydrate,
    subscribe,
    getState,
    createItem,
    bulkImport,
    bulkRemove,
    updateItem,
    deleteItem,
    tagSelector,
    definitionSchema,
  };
}
