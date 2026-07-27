import { debounce } from '@/lib/debounce';

type Option = {
  value: string | number;
  label: string;
};

type AutocompleteConfig = {
  el: HTMLElement;
  fetcher: (query: string) => Promise<Option[]>;
  onSelect: (option: Option) => void;
  initialValue?: Option;
};

export function mountAutocomplete(config: AutocompleteConfig) {
  const { el, fetcher, onSelect } = config;

  let results: Option[] = [];
  let cache: Record<string, Option[]> = {};

  el.innerHTML = `
    <input type="text" class="w-full border p-2 shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search..." />
    <div class="border mt-1 hidden" data-dropdown></div>
  `;

  const input = el.querySelector('input') as HTMLInputElement;
  const dropdown = el.querySelector('[data-dropdown]') as HTMLElement;

  if (config.initialValue) {
    input.value = config.initialValue.label;
    onSelect(config.initialValue);
  }

  const search = debounce(async (q: string) => {
    if (!q) {
      dropdown.innerHTML = '';
      dropdown.classList.add('hidden');
      return;
    }

    // cache hit
    if (cache[q]) {
      results = cache[q];
    } else {
      results = await fetcher(q);
      cache[q] = results;
    }

    dropdown.innerHTML = results
      .map(
        (r) => `
          <div data-value="${r.value}" class="p-2 hover:bg-gray-600 cursor-pointer text-white">
            ${r.label}
          </div>
        `
      )
      .join('');

    dropdown.classList.remove('hidden');
  }, 300);

  input.addEventListener('input', (e) => {
    search((e.target as HTMLInputElement).value);
  });

  dropdown.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const item = target.closest('[data-value]');
    if (!item) return;

    const value = item.getAttribute('data-value');
    const option = results.find((o) => String(o.value) === value);

    if (!option) return;

    input.value = option.label;
    dropdown.classList.add('hidden');

    onSelect(option);
  });

  // 🔥 API NUEVA
  return {
    setValue(option: Option) {
      input.value = option.label;
      onSelect(option);
    },

    clear() {
      input.value = '';
    },

    setOptions(newOptions: Option[]) {
      results = newOptions;
    }
  };
}
