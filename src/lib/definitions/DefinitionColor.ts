// src/lib/definitions/DefinitionColor.ts
import { t } from '@/lib/i18n/i18n';

export interface DefinitionColorOptions{

    container:HTMLElement;

    value?:string;

    onChange?(value:string):void;

}

export function mountDefinitionColor({

    container,

    value="#3b82f6",

    onChange

}:DefinitionColorOptions){

    container.innerHTML="";

    container.className="flex items-center gap-3";

    const preview=document.createElement("div");

    preview.className=
        "w-8 h-8 rounded-full border border-gray-300 cursor-pointer flex-shrink-0";

    preview.style.background=value;

    const label=document.createElement("span");

    label.className=
        "text-sm font-mono text-gray-600 dark:text-gray-300";

    label.textContent=value.toUpperCase();

    label.title=t('common.definition.click_to_copy');

    function showCopied(){

        const original=input.value.toUpperCase();

        label.textContent=`✓ ${t("common.definition.copied")}`;

        label.classList.add(

            "text-green-600",

            "font-semibold"

        );

        setTimeout(()=>{

            label.textContent=original;

            label.classList.remove(

                "text-green-600",

                "font-semibold"

            );

        },1000);

    }

    label.addEventListener(

        "click",

        async()=>{

            try{

                await navigator.clipboard.writeText(

                    input.value.toUpperCase()

                );

                showCopied();

            }

            catch{

            }

        }

    );

    const input=document.createElement("input");

    input.type="color";

    input.value=value;

    input.className="hidden";

    preview.addEventListener(

        "click",

        ()=>input.click()

    );

    input.addEventListener(

        "input",

        ()=>{

            const color=input.value.toUpperCase();

            preview.style.background=color;

            label.textContent=color;

            onChange?.(color);

        }

    );

    container.appendChild(preview);

    container.appendChild(label);

    container.appendChild(input);

    return{

        getValue(){

            return input.value.toUpperCase();

        },

        setValue(value:string){

            const color=value.toUpperCase();

            input.value=color;

            preview.style.background=color;

            label.textContent=color;

        }

    };

}