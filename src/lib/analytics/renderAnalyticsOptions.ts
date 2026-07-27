import { t } from '@/lib/i18n/i18n';

type AnalyticsOption = {
    value: string;
    label: string;
};

export function renderAnalyticsOptions(
    el: HTMLElement,
    analyticsId: string,
    options: AnalyticsOption[],
    activeValue: string | null,
    onSelect: (
        value: string
    ) => void
) {

    const container =
        el.querySelector(
            '[data-analytics-options]'
        );

    if (!container) {
        return;
    }

    container.innerHTML = '';

    /*
    * Duration has no selectable options.
    * Therefore the options area must be completely hidden.
    */

    if (!options.length) {

        container.classList.add(
            'hidden'
        );

        return;

    }

    container.classList.remove(
        'hidden'
    );

    const wrapper =
        document.createElement('div');

    wrapper.className = `
        inline-flex
        flex-wrap
        gap-1
        p-1
        bg-gray-100
        dark:bg-gray-700
        rounded-lg
    `;

    options.forEach(option => {

        const button =
            document.createElement('button');

        button.type =
            'button';

        button.dataset.analyticsOption =
            option.value;

        button.className = `
            px-4
            py-2
            text-sm
            font-medium
            rounded-md
            transition
            duration-150
            cursor-pointer
        `;

        const isActive =
            option.value === activeValue;

        if (isActive) {

            button.classList.add(
                'bg-white',
                'text-gray-900',
                'shadow-sm',
                'dark:bg-gray-800',
                'dark:text-white'
            );

        } else {

            button.classList.add(
                'text-gray-600',
                'hover:text-gray-900',
                'hover:bg-white/70',
                'dark:text-gray-300',
                'dark:hover:text-white',
                'dark:hover:bg-gray-800/70'
            );

        }

        button.textContent =
            t(option.label);

        button.addEventListener(
            'click',
            () => {

                if (
                    option.value ===
                    activeValue
                ) {
                    return;
                }

                onSelect(
                    option.value
                );

            }
        );

        wrapper.appendChild(
            button
        );

    });

    container.appendChild(
        wrapper
    );

}