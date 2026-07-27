export function template(
    placeholder:string
){

    return `

        <div class="relative">

            <div
                data-tags
                class="flex flex-wrap gap-2 mb-2">
            </div>

            <input

                data-input

                type="text"

                class="

                    w-full

                    rounded-lg

                    border

                    border-gray-300

                    p-2.5

                "

                placeholder="${placeholder}"

            />

            <div

                data-results

                class="

                    absolute

                    left-0

                    right-0

                    mt-1

                    hidden

                    bg-white

                    border

                    rounded-lg

                    shadow-lg

                    max-h-60

                    overflow-auto

                    z-50

                ">

            </div>

        </div>

    `;

}