// src/lib/resolveCrudFields.ts
import type { Field } from "./createCrudForm";

export function resolveCrudFields(
    fields: Field[],
    modules: Record<string, any>
): Field[] {

    return fields.map(field => {

        if (
            field.type !== "tag-selector" ||
            !field.component
        ) {
            return field;
        }

        return {

            ...field,

            component: {

                ...field.component,

                module:
                    modules[
                        field.component.module
                    ]

            }

        };

    });

}