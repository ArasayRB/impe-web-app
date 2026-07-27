// src/lib/definitions/types.ts
export type DefinitionField = {

    key: string;

    type:
        | "text"
        | "number"
        | "switch"
        | "select"
        | "multiselect"
        | "color";

    hidden?: boolean;

    default?: any;

    options?: {

        value: any;

        label: string;

    }[];

    dependsOn?:string;

    resolver?:(
        definition:any
    )=>SelectOption[];

    autoGenerateFrom?: string;

    transform?:(

        value:any,

        item:any

    )=>any;

};

export type DefinitionCollectionField = {

    key: string;

    type: "collection";

    schema: DefinitionField[];

};

export type DefinitionSection = {

    key: string;

	title: string;

    icon?:string;

    order?:number;

    defaultOpen?:boolean;

    visible?:(definition:any)=>boolean;

    fields: (
        DefinitionField
        |
        DefinitionCollectionField
    )[];

};
