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

            renderSwitch(container,{

                checked:!!value,

                disabled:props.disabled,

                onChange(v){

                    props.onChange?.(
                        v,
                        row
                    );

                }

            });

        }

    };

}