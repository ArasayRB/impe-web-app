export interface SwitchProps {

    checked: boolean;

    disabled?: boolean;

    size?: 'sm' | 'md' | 'lg';

    onChange?: (
        value: boolean
    ) => void;

}

export function renderSwitch(
    container: HTMLElement,
    props: SwitchProps
) {

    const {
        checked,
        disabled,
        size = 'md',
        onChange
    } = props;

    const sizes = {

        sm: {
            w: 'w-9',
            h: 'h-5',
            dot: 'after:h-4 after:w-4'
        },

        md: {
            w: 'w-11',
            h: 'h-6',
            dot: 'after:h-5 after:w-5'
        },

        lg: {
            w: 'w-14',
            h: 'h-7',
            dot: 'after:h-6 after:w-6'
        }

    };

    const s = sizes[size];

    container.innerHTML = `
        <label class="inline-flex cursor-pointer items-center">

            <input
                type="checkbox"
                class="peer sr-only"
                ${checked ? 'checked' : ''}
                ${disabled ? 'disabled' : ''}
            >

            <div
                class="
                ${s.w}
                ${s.h}
                rounded-full
                bg-gray-300
                peer
                peer-checked:bg-blue-600
                peer-focus:ring-4
                peer-focus:ring-blue-300
                relative

                after:absolute
                after:left-[2px]
                after:top-[2px]
                after:rounded-full
                after:border
                after:border-gray-300
                after:bg-white
                after:transition-all
                ${s.dot}
                peer-checked:after:translate-x-full
                ">
            </div>

        </label>
    `;

    container
        .querySelector('input')
        ?.addEventListener(
            'change',
            e => {

                onChange?.(
                    (
                        e.target as HTMLInputElement
                    ).checked
                );

            }
        );

}