import { renderSwitch } from '@/ui/Switch';

export function mountFormSwitch({

    container,

    value,

    onChange

}) {

    renderSwitch(
        container,
        {

            checked: value,

            onChange

        }
    );

}