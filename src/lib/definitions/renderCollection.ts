// src/lib/definitions/renderCollection.ts
import type { DefinitionField } from "./types";
import { t } from '@/lib/i18n/i18n';
import { autoGenerateField } from "./autoGenerateField";
import { createDefinitionInput, type DefinitionInputRenderer } from "./createDefinitionInput";

export interface CollectionRenderer{

    getValue(): any[];		

    setValue(value:any[]): void;

    refresh(): any[];

}

export function renderCollection(

    container: HTMLElement,

    schema: DefinitionField[],

    module: string,

    section: string,

    field: string,

    definition:any,

    notifyDefinitionChanged:()=>void,

    value: any[] = [],

    onChange?:(value:any[])=>void

): CollectionRenderer{

    container.innerHTML = "";

    const collection = Array.isArray(value)

    ? structuredClone(value)

    : [];

    const rowRenderers: Record<number, Record<string, DefinitionInputRenderer>> = {};

    const internalRenderers: any[] = [];

    function notify(){
        console.log("2. COLLECTION NOTIFY", section, field);

        onChange?.(

                structuredClone(collection)

        );
        console.log("notify on collection");
        notifyDefinitionChanged();

    }

    function render(){
        internalRenderers.length = 0;

        container.innerHTML = "";

        if(collection.length===0){

            const empty=document.createElement("div");

            empty.className=

                "text-sm italic text-gray-500 mb-3";

            empty.textContent=

                t(`${module}.definition.${section}.config.${field}.empty`);

            container.appendChild(empty);

        }
        
        const add=document.createElement("button");

        add.type="button";

        add.className=

            "px-3 py-2 rounded bg-primary-600 text-white mb-4";

        add.textContent=

            t(`${module}.definition.${section}.config.${field}.add`);
        
        container.appendChild(add);

        add.addEventListener("click",() =>{

            const item:any={};

            for(const field of schema){

                item[field.key]=

                    field.default ?? "";

            }

            if("order" in item){

                item.order = collection.length + 1;

            }

            collection.push(item);

						notify();

            render();

        });

        collection.forEach((item, index)=>{

            //card container

            const card=document.createElement("div");

            card.className=

                "border rounded-lg p-4 mb-4 bg-white dark:bg-gray-800";

            const header = document.createElement("div");

            header.className =
                "flex justify-between items-center mb-3 text-gray-600 dark:text-gray-300";

            const title = document.createElement("span");

            title.className =
                "font-medium text-gray-600 dark:text-gray-300";

            title.textContent =
                 `${t(
                        `${module}.definition.${section}.config.${field}.item.title`
                    )} ${index + 1}`;

            const remove = document.createElement("button");

            remove.type = "button";

            remove.className =
                "text-red-600 text-sm";

            remove.textContent = t(`${module}.definition.${section}.config.${field}.delete`);

            remove.addEventListener(

                "click",

                () => {

                    collection.splice(index,1);

                    collection.forEach(

                        (item,index)=>{

                            if("order" in item){

                                item.order = index + 1;

                            }

                        }

                    );

					notify();

                    render();

                }

            );

            header.appendChild(title);

            header.appendChild(remove);

            card.appendChild(header);

            rowRenderers[index] = {};

            for(const schemaField  of schema){
                if(schemaField.hidden){

                    continue;

                }
                
                const label=document.createElement("label");

                label.className=

                    "block mb-1 text-sm text-gray-600 dark:text-gray-300";

                label.textContent=t(

                    `${module}.definition.${section}.config.${field}.item.${schemaField.key}.label`

                );
								
                var input:any;
                const renderer = createDefinitionInput({

                    field:schemaField,

                    definition:definition,
                    
                    notifyDefinitionChanged,

                    value:item[schemaField.key],

                    onChange(value){
                            console.log("1. INPUT CHANGED", schemaField.key, value);
                            item[schemaField.key]=value;

                            autoGenerateField(

                                schema,

                                schemaField,

                                item,

                                rowRenderers[index]

                            );

                            notify();

                    }

                });

                rowRenderers[index][schemaField.key]=renderer;

                internalRenderers.push(renderer);


                card.appendChild(label);

                card.appendChild(

                        renderer.element

                );
                
            }

            container.appendChild(card);

        });

    }

    render();

    return{

        getValue(){

            return structuredClone(collection);

        },				

        setValue(value){

                collection.length=0;

                collection.push(

                        ...structuredClone(value)

                );

                notify();

                render();

        },

        refresh(){
            console.log(

                "6. collection.refresh",

                section,

                field

            );

            for(const renderer of internalRenderers){

                renderer.refresh?.(definition);

            }

        }

    };

}
