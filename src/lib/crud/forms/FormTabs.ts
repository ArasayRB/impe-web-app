import { t } from "@/lib/i18n/i18n";

export interface FormTab {
    id: string;
    label: string;
}

export interface FormTabsRenderer {
    getContainer(id: string): HTMLElement | null;
    getActiveTab(): string;
}

export interface RenderFormTabsOptions {
    onTabChange?: (tabId: string) => void;
}

export function renderFormTabs(
    container: HTMLElement,
    tabs: FormTab[],
    defaultTab?: string,
    options?: RenderFormTabsOptions
): FormTabsRenderer {

    container.innerHTML = "";

    const navigation = document.createElement("div");

    navigation.className = `
        flex
        flex-wrap
        items-center
        gap-1
        mb-6
        p-1
        rounded-xl
        bg-gray-100
        dark:bg-gray-800
    `;

    const content = document.createElement("div");

    const buttons = new Map<string, HTMLButtonElement>();
    const containers = new Map<string, HTMLElement>();

    let activeTab =
        defaultTab &&
        tabs.some(tab => tab.id === defaultTab)
            ? defaultTab
            : tabs[0]?.id ?? "";

    function updateTabs() {

        buttons.forEach(
            (button, id) => {

                if (id === activeTab) {

                    button.classList.add(
                        "bg-white",
                        "dark:bg-gray-700",
                        "shadow",
                        "text-primary-600"
                    );

                    button.classList.remove(
                        "hover:bg-white"
                    );

                } else {

                    button.classList.remove(
                        "bg-white",
                        "dark:bg-gray-700",
                        "shadow",
                        "text-primary-600"
                    );

                    button.classList.add(
                        "hover:bg-white"
                    );

                }

            }
        );

        containers.forEach(
            (element, id) => {

                element.classList.toggle(
                    "hidden",
                    id !== activeTab
                );

            }
        );

    }

    tabs.forEach(tab => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className = `
            px-4
            py-2
            rounded-lg
            text-sm
            font-medium
            transition-all
            duration-200
            text-gray-600
            dark:text-gray-300
            hover:bg-white
            hover:shadow-sm
        `;

        button.textContent = t(tab.label);

        button.addEventListener(
            "click",
            () => {

                activeTab = tab.id;

                updateTabs();

								options?.onTabChange?.(activeTab);


            }
        );

        navigation.appendChild(button);

        buttons.set(
            tab.id,
            button
        );

        const tabContainer =
            document.createElement("div");

        tabContainer.dataset.formTab =
            tab.id;

        content.appendChild(
            tabContainer
        );

        containers.set(
            tab.id,
            tabContainer
        );

    });

    container.appendChild(navigation);
    container.appendChild(content);

    updateTabs();

    return {

        getContainer(id) {

            return containers.get(id) ?? null;

        },

        getActiveTab() {

            return activeTab;

        }

    };

}
