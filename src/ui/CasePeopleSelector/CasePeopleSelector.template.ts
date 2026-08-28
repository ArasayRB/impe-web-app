export function casePeopleSelectorTemplate(
    placeholder: string
) {

    return `

        <div class="space-y-4">

            <div data-person-selector></div>

            <div
                data-selected-people
                class="space-y-3">
            </div>

        </div>

    `;

}
