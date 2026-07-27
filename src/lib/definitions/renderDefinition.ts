// src/lib/definitions/renderDefinition.ts
import type {DefinitionSection} from "./types";
import { t } from '@/lib/i18n/i18n';
import { renderDefinitionSection } from "./renderDefinitionSection";

export interface DefinitionRenderer {

    getValue(): any;

}

function getPathValue(obj:any,path:string){

    return path
        .split(".")
        .reduce(

            (o,key)=>o?.[key],

            obj

        );

}

function setPathValue(

    obj:any,

    path:string,

    value:any

){

    const keys = path.split(".");

    const last = keys.pop()!;

    let current = obj;

    for(const key of keys){

        if(

            typeof current[key] !== "object"

            ||

            current[key] === null

        ){

            current[key] = {};

        }

        current = current[key];

    }

    current[last] = value;

}

function createDefinitionFromSchema(
    schema: DefinitionSection[]
) {

    const definition:any = {

        version:1

    };

    schema.forEach(section=>{

        definition[section.key]={

            enabled:false,

            config:{}

        };

    });

    return definition;

}

export function renderDefinition(

    el: HTMLElement,

    schema: DefinitionSection[],

    module: string,

    value: any

): DefinitionRenderer {

    el.innerHTML = "";

    const definition = structuredClone(

        value && typeof value === "object"

            ? value

            : createDefinitionFromSchema(schema)

    );  

    const tabs=document.createElement("div");

    tabs.className="flex flex-wrap items-center gap-1 mb-6 p-1 rounded-xl bg-gray-100 dark:bg-gray-800";
    
    const sectionContainer=document.createElement("div");

    const buttons:HTMLButtonElement[]=[];

    // This handle a default tab required by 
    // schema configuration if came defined or tab in position 0 by default
    let activeSection=schema.findIndex(
        s => s.defaultOpen
    );

    if(activeSection < 0){

        activeSection = 0;

    }   

    function updateTabs(){

        buttons.forEach((button,index)=>{

                if(index===activeSection){

                    button.classList.add(
                        "bg-white",
                        "dark:bg-gray-700",
                        "shadow",
                        "text-primary-600"
                    );

                    button.classList.remove(
                        "hover:bg-white"
                    );

                }

                else{

                    button.classList.remove(
                        "bg-white",
                        "dark:bg-gray-700",
                        "shadow",
                        "text-primary-600"
                    );

                    button.classList.add(
                        "hover:bg-white"
                    );

                }

            });

    }

    //order sections before render it
    const sections=[...schema]

        .sort(

            (a,b)=>

                (a.order ?? 999)

                -

                (b.order ?? 999)

    );

    sections.forEach((section,index) => {

        const value = definition[section.key];

        if (

            value === null ||

            typeof value !== "object" ||

            Array.isArray(value)

        ) {

            definition[section.key] = {};

        }

        const button=document.createElement("button");
        buttons.push(button);

        button.type="button";

        button.className = `
        px-4
        py-2
        rounded-lg
        text-sm
        font-medium
        transition-all
        duration-200
        text-gray-600
        dark:text-gray-300
        hover:bg-white
        hover:shadow-sm
        `;

        button.textContent=t(
            `${module}.definition.${section.key}.config.title`
        );

        button.onclick=()=>{
            activeSection=index;
            updateTabs();
            renderDefinitionSection({

                container:sectionContainer,

                section:sections[activeSection],

                module,

                definition,

                getPathValue,

                setPathValue

            });
        };

        tabs.appendChild(button);

    });

    

    el.appendChild(tabs);

    el.appendChild(sectionContainer);
    
    updateTabs();
    
    renderDefinitionSection({

        container:sectionContainer,

        section:sections[activeSection],

        module,

        definition,

        getPathValue,

        setPathValue

    });
    
    return {

        getValue(){

            return structuredClone(

                definition

            );

        }

    };

}
