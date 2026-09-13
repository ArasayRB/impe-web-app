import { t } from '@/lib/i18n/i18n';

type CaseDataField = {
    key: string;
    label: string;
    type: string;
    required?: boolean;
};

type RenderCaseDataParams = {
    container: HTMLElement;
    fields: CaseDataField[];
    values: Record<string, any>;
};

export function renderCaseData({
    container,
    fields,
    values
}: RenderCaseDataParams) {

    const data: Record<string, any> = {
        ...values
    };

    function render() {

        container.innerHTML = `
            <div class="grid grid-cols-6 gap-6">
                ${fields.map(field => {

                    const value =
                        data[field.key] ?? '';

                    return `
                        <div class="col-span-6 sm:col-span-3">

                            <label
                                class="
                                    block
                                    mb-2
                                    text-sm
                                    font-medium
                                    text-gray-900
                                    dark:text-white
                                "
                            >
                                ${field.label}
                                ${
                                    field.required
                                        ? '<span class="text-red-500">*</span>'
                                        : ''
                                }
                            </label>

                            <input
                                type="text"
                                data-case-data="${field.key}"
                                value="${escapeHtml(value)}"
                                class="
                                    shadow-sm
                                    bg-gray-50
                                    border
                                    border-gray-300
                                    text-gray-900
                                    sm:text-sm
                                    rounded-lg
                                    focus:ring-primary-500
                                    focus:border-primary-500
                                    block
                                    w-full
                                    p-2.5
                                    dark:bg-gray-700
                                    dark:border-gray-600
                                    dark:text-white
                                "
                            />

                        </div>
                    `;

                }).join('')}
            </div>
        `;

        container
            .querySelectorAll<HTMLInputElement>(
                '[data-case-data]'
            )
            .forEach(input => {

                input.addEventListener('input', () => {

                    const key =
                        input.dataset.caseData;

                    if (!key) return;

                    data[key] = input.value;

                });

            });
    }

    render();

    return {

        getValue(): Record<string, any> {
            return {
                ...data
            };
        }

    };
}

function escapeHtml(value: any): string {

    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

}
