// src/lib/definitions/autoGenerateField.ts
import type { DefinitionField } from "./types";
import { slugToKey } from "@/lib/utils/slugToKey";
import type { DefinitionInputRenderer } from "./createDefinitionInput";

export function autoGenerateField(

    schema: DefinitionField[],

    changedField: DefinitionField,

    item: Record<string, any>,

    renderers: Record<string, DefinitionInputRenderer>

){

    for(const field of schema){

        if(field.autoGenerateFrom !== changedField.key){

            continue;

        }

        const source = item[changedField.key];

        const value =  field.transform

            ? field.transform(source,item)

            : slugToKey(String(source ?? ""));

        item[field.key] = value;

        renderers[field.key]?.setValue(value);

    }

}