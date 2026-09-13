import { renderSwitch } from '@/ui/Switch';
import type { CrudCellComponent } from "../crudColumn";

export interface CrudSwitchProps<T> {

    disabled?: boolean;

    onChange?: (
        value: boolean,
        row: T
    ) => void | Promise<void>;

}

export function createCrudSwitch<T>(
    props: CrudSwitchProps<T>
): CrudCellComponent<T> {

    return {

        mount(container, value, row) {

            const checked = !!value;

            const mountSwitch = (
                currentValue: boolean
            ) => {

                renderSwitch(container, {

                    checked: currentValue,

                    disabled: props.disabled,

                    onChange: async (nextValue) => {

                        try {

                            await props.onChange?.(
                                nextValue,
                                row
                            );

                        } catch (error) {

                            /*
                             * Restore previous state
                             * when the action fails.
                             */
                            mountSwitch(
                                currentValue
                            );

                        }

                    }

                });

            };

            mountSwitch(checked);

        }

    };

}
