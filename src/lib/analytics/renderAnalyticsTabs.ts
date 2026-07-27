import { t } from '@/lib/i18n/i18n';

type AnalyticsTab = {
    id: string;
    label: string;
};

export function renderAnalyticsTabs(
    el: HTMLElement,
    tabs: AnalyticsTab[],
    activeAnalyticsId: string | null,
    onSelect: (
        analyticsId: string
    ) => void
) {

    const container =
        el.querySelector(
            '[data-analytics-tabs]'
        );

    if (!container) {
        return;
    }

    container.innerHTML = '';

    const nav =
        document.createElement('div');

    nav.className = `
        flex
        gap-2
        border-b
        border-gray-200
        dark:border-gray-700
        overflow-x-auto
    `;

    tabs.forEach(tab => {

        const button =
            document.createElement('button');

        const active =
            tab.id === activeAnalyticsId;

        button.type =
            'button';

        button.dataset.analyticsTab =
            tab.id;

        button.className = `
            px-4
            py-2
            text-sm
            font-medium
            whitespace-nowrap
            border-b-2
            transition
            ${
                active
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }
        `;

        button.textContent =
            t(tab.label);

        button.addEventListener(
            'click',
            () => {

                onSelect(
                    tab.id
                );

            }
        );

        nav.appendChild(
            button
        );

    });

    container.appendChild(
        nav
    );

}