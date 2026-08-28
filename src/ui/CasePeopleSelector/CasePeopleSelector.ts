import { UIComponent } from "../uiComponent";
import { renderTagSelector } from "../TagSelector/TagSelector";
import type { TagItem } from "../TagSelector/TagSelector.types";
import type {
    CasePeopleSelectorProps,
    CasePersonItem
} from "./CasePeopleSelector.types";
import { casePeopleSelectorTemplate } from "./CasePeopleSelector.template";
import { t } from "@/lib/i18n/i18n";

export class CasePeopleSelector
    extends UIComponent<CasePeopleSelectorProps> {

    private selectorContainer!: HTMLElement;

    private selectedContainer!: HTMLElement;

    private selected: CasePersonItem[] = [];

		private tagSelector?: ReturnType<
				typeof renderTagSelector
		>;

    constructor(
        container: HTMLElement,
        props: CasePeopleSelectorProps
    ) {

        super(container, props);

        this.selected = Array.isArray(props.value)
            ? structuredClone(props.value)
            : [];

        this.mount();

    }

    render() {

        this.container.innerHTML =
            casePeopleSelectorTemplate(
                this.props.placeholder ?? ""
            );

        this.selectorContainer =
            this.container.querySelector(
                "[data-person-selector]"
            ) as HTMLElement;

        this.selectedContainer =
            this.container.querySelector(
                "[data-selected-people]"
            ) as HTMLElement;

        this.renderTagSelector();

        this.renderSelected();

    }

    private renderTagSelector() {

        this.tagSelector?.destroy();

				this.tagSelector =
						renderTagSelector(

								this.selectorContainer,

								{

										value: this.selected.map(
												person => ({
														id: person.person_id,
														label: person.label
												})
										),

										max: this.props.max,

										placeholder:
												this.props.placeholder,

										noResultsText:
												this.props.noResultsText,

										searchingText:
												this.props.searchingText,

										search: async (text) => {

												const people =
														await this.props.search(text);

												return people.filter(
														person =>
																person.id !== this.props.customerId
												);

										},

										create:
												this.props.create,

										onCreateRequested:
												this.props.onCreateRequested,

										createText:
												this.props.createText,

										onChange: tags => {

												this.handleSelection(tags);

										}

								}

						);

    }

    private handleSelection(
        tags: TagItem[]
    ) {

        const selectedById =
            new Map<number, CasePersonItem>();

        this.selected.forEach(
            person => {

                selectedById.set(
                    person.person_id,
                    person
                );

            }
        );

        this.selected =
            tags.map(tag => {

                const existing =
                    selectedById.get(tag.id);

                return {

                    person_id: tag.id,

                    label: tag.label,

                    relationship:
                        existing?.relationship
                        ??
                        this.props
                            .relationshipOptions[0]
                            ?.value
                        ??
                        ""

                };

            });

        this.renderSelected();

        this.props.onChange?.(
            structuredClone(
                this.selected
            )
        );

    }

    private renderSelected() {

        this.selectedContainer.innerHTML = "";

        this.selected.forEach(
            (person, index) => {

                const card =
                    document.createElement("div");

                card.className = `
                    border
                    rounded-lg
                    p-4
                    bg-white
                    dark:bg-gray-800
                `;

                const header =
                    document.createElement("div");

                header.className = `
                    flex
                    justify-between
                    items-center
                    mb-3
                `;

                const name =
                    document.createElement("span");

                name.className = `
                    font-medium
                    text-gray-700
                    dark:text-gray-200
                `;

                name.textContent =
                    person.label;

                const remove =
                    document.createElement("button");

                remove.type = "button";

                remove.className = `
                    text-red-600
                    text-sm
                `;

                remove.textContent = "×";

                remove.addEventListener(
                    "click",
                    () => {

                        this.removePerson(
                            person.person_id
                        );

                    }
                );

                header.appendChild(name);

                header.appendChild(remove);

                card.appendChild(header);

                const label =
                    document.createElement("label");

                label.className = `
                    block
                    mb-1
                    text-sm
                    text-gray-600
                    dark:text-gray-300
                `;

                label.textContent =
    							t("cases.fields.relationship");

                card.appendChild(label);

                const select =
                    document.createElement("select");

                select.className = `
                    w-full
                    border
                    rounded
                    px-3
                    py-2
                `;

                this.props
                    .relationshipOptions
                    .forEach(option => {

                        const element =
                            document.createElement(
                                "option"
                            );

                        element.value =
                            option.value;

                        element.textContent =
    												t(option.label);

                        element.selected =
                            option.value ===
                            person.relationship;

                        select.appendChild(
                            element
                        );

                    });

                select.addEventListener(
                    "change",
                    () => {

                        this.selected[index]
                            .relationship =
                            select.value;

                        this.props.onChange?.(
                            structuredClone(
                                this.selected
                            )
                        );

                    }
                );

                card.appendChild(select);

                this.selectedContainer
                    .appendChild(card);

            }
        );

    }

    private removePerson(
        personId: number
    ) {

        this.selected =
            this.selected.filter(
                person =>
                    person.person_id !== personId
            );

        this.renderTagSelector();

        this.renderSelected();

        this.props.onChange?.(
            structuredClone(
                this.selected
            )
        );

    }

    getValue(): CasePersonItem[] {

        return structuredClone(
            this.selected
        );

    }

    setValue(
        value: CasePersonItem[]
    ) {

        this.selected =
            Array.isArray(value)
                ? structuredClone(value)
                : [];

        this.render();

    }

    destroy() {

				this.tagSelector?.destroy();

				this.container.innerHTML = "";

		}

}

export function renderCasePeopleSelector(
    container: HTMLElement,
    props: CasePeopleSelectorProps
) {

    return new CasePeopleSelector(
        container,
        props
    );

}
