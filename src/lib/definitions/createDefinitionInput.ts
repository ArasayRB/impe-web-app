// src/lib/definitions/createDefinitionInput.ts

import { mountFormSwitch } from '@/lib/crud/forms/FormSwitch';
import { t } from '@/lib/i18n/i18n';
import type { DefinitionField } from "./types";
import { mountDefinitionColor } from "./DefinitionColor";

export interface DefinitionInputRenderer{

    element: HTMLElement;

    getValue(): any;

    setValue(value:any): void;

    refresh?(definition:any): void;

}

function rebuildSelect(

    select:HTMLSelectElement,

    options:SelectOption[]

){

    const current =

        Array.from(select.selectedOptions)

            .map(o=>o.value);

    select.innerHTML="";

    for(const option of options){

        const opt=document.createElement("option");

        opt.value=String(option.value);

        opt.textContent=t(option.label);

        opt.selected=current.includes(opt.value);

        select.appendChild(opt);

    }

}

export function createDefinitionInput({

    field,

    definition,
    
    notifyDefinitionChanged,

    value,

    onChange

}:{

    field:DefinitionField;

    definition:any;

    notifyDefinitionChanged?:()=>void

    value:any;

    onChange(value:any):void;

}):DefinitionInputRenderer{


    switch(field.type){

        case "switch":{

            const container = document.createElement("div");

            let current = !!value;

            mountFormSwitch({

                container,

                value:current,

                onChange(v){

                    current=v;

                    onChange(v);

                    notifyDefinitionChanged?.();

                }

            });

            return{

                element:container,

                getValue(){

                    return current;

                },

                setValue(v){

                    current=!!v;

                }

            };

        }

        case "color":{

            const container=document.createElement("div");

            let current=value ?? "#3b82f6";

            const picker=

                mountDefinitionColor({

                    container,

                    value:current,

                    onChange(v){

                        current=v;

                        onChange(v);

                        notifyDefinitionChanged?.();

                    }

                });

            return{

                element:container,

                getValue(){

                    return picker.getValue();

                },

                setValue(v){

                    current=v;

                    picker.setValue(v);

                }

            };

        }

        case "select":
        case "multiselect":{
            console.log("FIELD", field.key);
            console.log("DEFINITION", definition);

            const options = field.resolver
                ? field.resolver(definition)
                : (field.options ?? []);

            const select = document.createElement("select");

            select.className =
                "w-full border rounded px-3 py-2";

            if(field.type==="multiselect"){

                select.multiple = true;

                select.size = Math.min(
                    Math.max(options.length,3),
                    8
                );

            }

            const values = Array.isArray(value)
                ? value.map(String)
                : [String(value ?? "")];

            for(const option of options){

                const opt=document.createElement("option");

                opt.value=String(option.value);

                opt.textContent=t(option.label);

                opt.selected =
                    values.includes(
                        String(option.value)
                    );

                select.appendChild(opt);

            }

            select.addEventListener("change",()=>{

                if(field.type==="multiselect"){

                    const values = Array.from(

                        select.selectedOptions

                    ).map(

                        option=>option.value

                    );

                    onChange(values);
console.log("notify on multiselect definition input");
                    notifyDefinitionChanged?.();

                    return;

                }

                onChange(select.value);
                console.log("notify after multiselect definition input");
                notifyDefinitionChanged?.();

            });

            return{

                element:select,

                getValue(){

                    if(field.type==="multiselect"){

                        return Array.from(

                            select.selectedOptions

                        ).map(

                            option=>option.value

                        );

                    }

                    return select.value;

                },

                setValue(v){

                    const values = Array.isArray(v)

                        ? v.map(String)

                        : [String(v)];

                    Array.from(select.options)

                        .forEach(option=>{

                            option.selected = values.includes(

                                option.value

                            );

                        });

                },

                refresh(){

                    if(!field.resolver){
                        return;
                    }

                    const options = field.resolver(definition);

                    rebuildSelect(select, options);

                }

            };

        }
        

        default:{

            const input=document.createElement("input");

            input.type=field.type;

            input.className=

                "w-full border rounded px-3 py-2";

            input.value=value ?? "";

            input.addEventListener("input",()=>{

                let newValue:any=input.value;

                if(field.type==="number"){

                    newValue=

                        input.value===""

                        ? null

                        : Number(input.value);

                }

                onChange(newValue);
                console.log("notify on number definition input");
                notifyDefinitionChanged?.();

            });

            return{

                element:input,

                getValue(){

										if(field.type==="number"){

												return input.value===""

														? null

														: Number(input.value);

										}

										return input.value;

								},

                setValue(v){

                    input.value=v;

                }

            };

        }

    }
    

}
