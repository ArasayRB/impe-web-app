import { t } from "@/lib/i18n/i18n";
import { mountFormSwitch } from "@/lib/crud/forms/FormSwitch";
import { createDefinitionInput } from "./createDefinitionInput";
import { renderCollection } from "./renderCollection";
import type { DefinitionSection } from "./types";
import { DefinitionRegistry } from "./DefinitionRegistry";

export interface RenderDefinitionSectionOptions{

    container:HTMLElement;

    section:DefinitionSection;

    module:string;

    definition:any;

    getPathValue(obj:any,path:string):any;

    setPathValue(obj:any,path:string,value:any):void;

}

export function renderDefinitionSection({

    container,

    section,

    module,

    definition,

    getPathValue,

    setPathValue

}:RenderDefinitionSectionOptions){    

    const registry = new DefinitionRegistry();

    function notifyDefinitionChanged(){
        console.log("4.0. notifyDefinitionChanged()",definition);
    
        //registry.clear();

        registry.refresh(definition);

    }

    container.innerHTML="";

    const card=document.createElement("div");

    card.className=
        "border rounded-lg p-4 mb-6";

    container.appendChild(card);

    const title=document.createElement("h3");

    title.className=
        "font-semibold text-lg mb-4";

    title.textContent=t(
        `${module}.definition.${section.key}.config.title`
    );

    card.appendChild(title);

    const enabledWrapper = document.createElement("div");

    enabledWrapper.className = "mb-4";

    const enabledLabel = document.createElement("label");

    enabledLabel.className = "block mb-1 text-sm";

    enabledLabel.textContent = t(
        `${module}.definition.${section.key}.enabled.label`
    );

    enabledWrapper.appendChild(enabledLabel);

    const switchContainer = document.createElement("div");

    enabledWrapper.appendChild(switchContainer);
    
    console.log("render section");

    mountFormSwitch({

        container: switchContainer,

        value: !!getPathValue(
            definition,
            `${section.key}.enabled`
        ),

        onChange(value){

            setPathValue(

                definition,

                `${section.key}.enabled`,

                value

            );
            registry.refresh(definition);

        }

    });

    card.appendChild(enabledWrapper);
    for(const field of section.fields){

        console.log(field.key);

        if(field.type === "collection"){

                const wrapper = document.createElement("div");

                wrapper.className = "mb-6";

                const label = document.createElement("label");

                label.className = "block mb-2 text-sm";

                label.textContent = t(

                    `${module}.definition.${section.key}.config.${field.key}.label`

                );

                wrapper.appendChild(label);

                const collectionContainer = document.createElement("div");

                wrapper.appendChild(collectionContainer);

                const renderer = renderCollection(

                    collectionContainer,

                    field.schema,

                    module,

                    section.key,

                    field.key,

                    definition,
                    
                    notifyDefinitionChanged,

                    getPathValue(

                            definition,

                            `${section.key}.config.${field.key}`

                    ) ?? [],

                    (items)=>{
                        console.log("3. SET PATH", section.key, field.key);

                            setPathValue(

                                    definition,

                                    `${section.key}.config.${field.key}`,

                                    items

                            );
                            console.log(
                                definition.statuses.config.items
                            );

                    }

                );

                registry.register({

                    field,

                    refresh:renderer.refresh

                });

                card.appendChild(wrapper);

                continue;

            }

        const path = `${section.key}.config.${field.key}`;

            const wrapper = document.createElement("div");

            wrapper.className="mb-4";

            const label = document.createElement("label");

            label.className="block mb-1 text-sm";

            label.textContent = t(`${module}.definition.${section.key}.config.${field.key}.label`);

            wrapper.appendChild(label);

            const current = getPathValue(

                definition,

                path

            );

            const renderer = createDefinitionInput({

                    field,
                    
                    definition:definition,

                    notifyDefinitionChanged,

                    value:current,

                    onChange(value){

                            setPathValue(

                                    definition,

                                    path,

                                    value

                            );
                            registry.refresh(definition);

                    }

            });
            registry.register({

                field,

                refresh:renderer.refresh

            });

            wrapper.appendChild(

                    renderer.element

            );

            card.appendChild(wrapper);

    }

}