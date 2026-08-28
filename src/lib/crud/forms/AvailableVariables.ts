// src/lib/crud/forms/AvailableVariables.ts
export interface AvailableVariable {
  key: string;
  label: string;
  resolver: string;
  type: string;
}

export interface AvailableVariableGroup {
  group: string;
  key: string;
  variables: AvailableVariable[];
}

export interface AvailableVariablesOptions {
  container: HTMLElement;
  groups: AvailableVariableGroup[];
  title?: string;
  searchPlaceholder?: string;
  emptyText?: string;
}

export function renderAvailableVariables(
  options: AvailableVariablesOptions
) {

  const {
    container,
    groups,
    title = 'Available variables',
    searchPlaceholder = 'Search variables...',
    emptyText = 'No variables found.',
  } = options;

  let searchTerm = '';

  function normalize(value: string) {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function matches(variable: AvailableVariable) {

    if (!searchTerm) {
      return true;
    }

    const search = normalize(searchTerm);

    return (
      normalize(variable.key).includes(search) ||
      normalize(variable.label).includes(search) ||
      normalize(variable.resolver).includes(search)
    );
  }

  function render() {

    const filteredGroups = groups
      .map(group => ({
        ...group,
        variables: group.variables.filter(matches),
      }))
      .filter(group => group.variables.length > 0);

    container.innerHTML = `

      <div
        class="
          col-span-12
          border
          border-gray-200
          rounded-lg
          dark:border-gray-700
          bg-white
          dark:bg-gray-800
        "
      >

        <div class="p-4 border-b border-gray-200 dark:border-gray-700">

          <h3
            class="
              text-base
              font-semibold
              text-gray-900
              dark:text-white
              mb-3
            "
          >
            ${title}
          </h3>

          <input
            type="text"
            data-available-variables-search
            value="${searchTerm}"
            placeholder="${searchPlaceholder}"
            class="
              w-full
              p-2.5
              text-sm
              text-gray-900
              bg-gray-50
              border
              border-gray-300
              rounded-lg
              focus:ring-primary-500
              focus:border-primary-500
              dark:bg-gray-700
              dark:border-gray-600
              dark:text-white
              dark:placeholder-gray-400
            "
          />

        </div>

        <div
          data-available-variables-list
          class="divide-y divide-gray-200 dark:divide-gray-700"
        >

          ${
            filteredGroups.length
              ? filteredGroups
                  .map(renderGroup)
                  .join('')
              : `
                <div
                  class="
                    p-6
                    text-center
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  ${emptyText}
                </div>
              `
          }

        </div>

      </div>

    `;

    bindEvents();

  }

  function renderGroup(
    group: AvailableVariableGroup
  ) {

    return `

      <details
        class="
          group
          available-variable-group
        "
      >

        <summary
          class="
            cursor-pointer
            list-none
            flex
            items-center
            justify-between
            px-4
            py-3
            text-sm
            font-medium
            text-gray-900
            dark:text-white
            hover:bg-gray-50
            dark:hover:bg-gray-700
          "
        >

          <span>
            ${group.group}
          </span>

          <span
            class="
              text-xs
              text-gray-500
              dark:text-gray-400
            "
          >
            ${group.variables.length}
          </span>

        </summary>

        <div
          class="
            px-4
            pb-4
            space-y-2
          "
        >

          ${group.variables
            .map(renderVariable)
            .join('')}

        </div>

      </details>

    `;
  }

  function renderVariable(
    variable: AvailableVariable
  ) {

    return `

      <div
        class="
          flex
          items-center
          justify-between
          gap-4
          p-3
          rounded-lg
          bg-gray-50
          dark:bg-gray-700/50
        "
      >

        <div class="min-w-0">

          <div
            class="
              text-sm
              font-medium
              text-gray-900
              dark:text-white
            "
          >
            ${variable.label}
          </div>

          <code
            class="
              block
              mt-1
              text-xs
              text-gray-600
              dark:text-gray-300
              break-all
            "
          >
            \${${variable.key}}
          </code>

        </div>

        <button
          type="button"
          data-copy-variable="${variable.key}"
          class="
            shrink-0
            px-3
            py-1.5
            text-xs
            font-medium
            text-primary-700
            bg-white
            border
            border-gray-300
            rounded-lg
            hover:bg-gray-100
            dark:bg-gray-800
            dark:text-primary-400
            dark:border-gray-600
            dark:hover:bg-gray-700
          "
        >
          Copy
        </button>

      </div>

    `;
  }

  function bindEvents() {

    const search =
      container.querySelector(
        '[data-available-variables-search]'
      ) as HTMLInputElement | null;

    search?.addEventListener(
      'input',
      () => {

        searchTerm = search.value;

        render();

        const newSearch =
          container.querySelector(
            '[data-available-variables-search]'
          ) as HTMLInputElement | null;

        if (newSearch) {

          newSearch.focus();

          newSearch.setSelectionRange(
            searchTerm.length,
            searchTerm.length
          );

        }

      }
    );

    container
      .querySelectorAll(
        '[data-copy-variable]'
      )
      .forEach(button => {

        button.addEventListener(
          'click',
          async () => {

            const key =
              button.getAttribute(
                'data-copy-variable'
              );

            if (!key) return;

            const value = `\${${key}}`;

            try {

              await navigator.clipboard.writeText(
                value
              );

              const originalText =
                button.textContent;

              button.textContent = 'Copied!';

              setTimeout(() => {

                button.textContent =
                  originalText ?? 'Copy';

              }, 1200);

            } catch (error) {

              console.error(
                'Unable to copy variable',
                error
              );

            }

          }
        );

      });

  }

  render();

  return {
    refresh() {
      render();
    },

    destroy() {
      container.innerHTML = '';
    },
  };
}
