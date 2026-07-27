import { UIComponent } from "../uiComponent";
import { debounce } from "@/lib/debounce";
import { template } from "./TagSelector.template";
import type {
    TagItem,
    TagSelectorProps
} from "./TagSelector.types";

export class TagSelector extends UIComponent<TagSelectorProps> {

    private input!: HTMLInputElement;

    private tags!: HTMLElement;

    private results!: HTMLElement;

    private selected: TagItem[] = [];

    private items: TagItem[] = [];

    private highlightedIndex = -1;

    private searchId = 0;

    private searching = false;

    private search = debounce(

        async () => {

            await this.performSearch();

        },

        300

    );

    private clickOutside = (

        e:MouseEvent

    )=>{

        if(

            !this.container.contains(

                e.target as Node

            )

        ){

            this.hide();

        }

    };

    constructor(
        container: HTMLElement,
        props: TagSelectorProps
    ) {

        super(container, props);

        this.selected = Array.isArray(props.value)
            ? [...props.value]
            : [];

        this.mount();

    }

    render() {

        this.container.innerHTML = template(

            this.props.placeholder ?? ""

        );

        this.tags = this.container.querySelector(

            "[data-tags]"

        ) as HTMLElement;

        this.input = this.container.querySelector(

            "[data-input]"

        ) as HTMLInputElement;

        this.results = this.container.querySelector(

            "[data-results]"

        ) as HTMLElement;

        this.input.disabled = !!this.props.disabled;

        this.input.readOnly = !!this.props.readonly;

        this.renderTags();

        this.bindEvents();

    }

    private renderTags() {

        this.tags.innerHTML = this.selected
            .map(tag => `

                <span
                    class="
                        inline-flex
                        items-center
                        rounded-full
                        bg-blue-100
                        text-blue-800
                        px-3
                        py-1
                        text-sm
                    ">

                    ${tag.label}

                    ${this.props.readonly || this.props.disabled
                        ? ""
                        : `
                        <button
                            type="button"
                            data-remove="${tag.id}"
                            class="ml-2">
                            ×
                        </button>
                        `
                    }

                </span>

            `)
            .join("");

        this.tags

            .querySelectorAll("[data-remove]")

            .forEach(button => {

                button.addEventListener(

                    "click",

                    () => {

                        const id = Number(

                            (button as HTMLElement)

                            .dataset.remove

                        );

                        this.removeTag(id);

                    }

                );

            });

    }

    private removeTag(
        id: number
    ) {

        this.selected = this.selected.filter(

            x => x.id !== id

        );

        this.renderTags();

        this.props.onChange?.(

            [...this.selected]

        );

    }

    private show() {

        this.results.classList.remove(

            "hidden"

        );

    }

    private hide() {

        this.results.classList.add(

            "hidden"

        );

        this.highlightedIndex = -1;

    }

    private clear() {

        this.input.value = "";

        this.hide();

    }

    private renderSearching() {

        this.show();

        this.results.innerHTML = `

            <div
                class="px-4 py-3 text-sm text-gray-500">

                ${this.props.searchingText ?? "Searching..."}

            </div>

        `;

    }

    private renderEmpty() {

        this.show();

        this.results.innerHTML = `

            <div
                class="px-4 py-3 text-sm text-gray-500">

                ${this.props.noResultsText ?? "No results"}

            </div>

        `;

        if (!this.props.create && !this.props.onCreateRequested) {

            return;

        }

        const create = document.createElement("button");

        create.type = "button";

        create.className = `
            w-full
            text-left
            px-4
            py-2
            border-t
            text-blue-600
            hover:bg-gray-50
        `;

        create.textContent =
            this.props.createText?.(

                this.input.value

            )

            ??

            `Create "${this.input.value}"`;

        create.onmousedown = async e => {

            e.preventDefault();

            let tag: TagItem | undefined;

            if (this.props.onCreateRequested) {

                tag = await this.props.onCreateRequested(

                    this.input.value

                );

            } else if (this.props.create) {

                tag = await this.props.create(

                    this.input.value

                );

            }
console.log('the tag',tag)
            if (tag) {

                this.select(tag);

            }

        };

        this.results.appendChild(create);

    }

    private renderResults(
        items: TagItem[]
    ) {

        this.items = items;

        if (!items.length) {

            this.renderEmpty();

            return;

        }

        this.show();

        this.results.innerHTML = "";

        items.forEach(item => {

            const button = document.createElement("button");

            button.type = "button";

            button.className = `
                block
                w-full
                text-left
                px-4
                py-2
                hover:bg-gray-100
            `;

            button.textContent = item.label;

            button.dataset.item = "1";

            button.onmousedown = e => {

                e.preventDefault();

                this.select(item);

            };

            this.results.appendChild(button);

        });

    }

    private select(
        tag: TagItem
    ) {

        if (this.props.max === 1) {

            this.selected = [tag];

        } else {

            this.selected = [

                ...this.selected.filter(

                    x => x.id !== tag.id

                ),

                tag

            ];

        }

        this.renderTags();

        this.props.onChange?.(

            [...this.selected]

        );

        this.clear();

    }

    private async performSearch() {

        const text = this.input.value.trim();

        if (!text) {

            this.hide();

            return;

        }

        const id = ++this.searchId;

        this.searching = true;

        this.renderSearching();

        try {

            const items = await this.props.search(

                text

            );

            if (id !== this.searchId) {

                return;

            }

            this.searching = false;

            this.renderResults(items);

        }
        catch {

            if (id !== this.searchId) {

                return;

            }

            this.searching = false;

            this.renderEmpty();

        }

    }

    private bindEvents() {

        this.input.oninput = () => {

            this.search();

        };

        this.input.onfocus = () => {

            if (

                this.input.value.trim()

            ) {

                this.search();

            }

        };

        this.input.onblur = () => {

            setTimeout(

                () => this.hide(),

                150

            );

        };

        this.input.onkeydown = e=>this.onKeyDown(e);

        document.addEventListener(

            "click",

            this.clickOutside

        );

    }
    

    private onKeyDown(
        e: KeyboardEvent
    ) {

        if (

            this.results.classList.contains("hidden")

        ) {

            return;

        }

        switch (e.key) {

            case "ArrowDown":

                e.preventDefault();

                this.highlight(

                    this.highlightedIndex + 1

                );

                break;

            case "ArrowUp":

                e.preventDefault();

                this.highlight(

                    this.highlightedIndex - 1

                );

                break;

            case "Enter":

                e.preventDefault();

                const item = this.items[
                    this.highlightedIndex
                ];

                if (item) {

                    this.select(item);

                }

                break;

            case "Escape":

                this.hide();

                break;

        }

    }

    private highlight(
        index:number
    ){

        const buttons=[

            ...this.results.querySelectorAll(

                "[data-item]"

            )

        ] as HTMLElement[];

        if(!buttons.length){

            return;

        }

        if(index<0){

            index=buttons.length-1;

        }

        if(index>=buttons.length){

            index=0;

        }

        this.highlightedIndex=index;

        buttons.forEach(

            x=>x.classList.remove(

                "bg-blue-100"

            )

        );

        buttons[index]

            .classList.add(

                "bg-blue-100"

            );

        buttons[index].scrollIntoView({

            block:"nearest"

        });

    }

    destroy(){

        document.removeEventListener(

            "click",

            this.clickOutside

        );

    }

}

export function renderTagSelector(
    container: HTMLElement,
    props: TagSelectorProps
) {
    return new TagSelector(container, props);
}