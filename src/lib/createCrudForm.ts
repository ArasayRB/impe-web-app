import { modalController } from '@/lib/modal.controller';
import { showSuccess, showError } from '@/lib/toast';
import { lockElement, unlockElement } from '@/lib/ui.interaction';
import { t } from '@/lib/i18n/i18n';
import { i18nVersion } from '@/lib/i18n/store';
import { mountFormSwitch } from '@/lib/crud/forms/FormSwitch';
import { renderTagSelector } from '@/ui/TagSelector/TagSelector';
import { renderCasePeopleSelector } from '@/ui/CasePeopleSelector/CasePeopleSelector';
import {renderDefinition} from "@/lib/definitions/renderDefinition";
import {renderFormTabs, type FormTab} from '@/lib/crud/forms/FormTabs';
import { renderAvailableVariables, type AvailableVariableGroup } from '@/lib/crud/forms/AvailableVariables';

export type SelectOption={

    value:any;

    label:string;

};

export type Field = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'date' | 'password' | 'textarea' | 'checkbox' | 'switch' | 'tag-selector' | 'definition' | 'case-people' | 'file';
  tab?: string;
	default?: any;
  required?: boolean;
  validate?: (value: any) => string | null;
  options?: { value: string; label: string }[];
  component?:{

			module?:any;

			schema?:DefinitionSection[];

			search?:(text:string)=>Promise<TagItem[]>;

			create?:(text:string)=>Promise<TagItem>;

			onCreateRequested?;

			max?:number;

			relationshipOptions?: SelectOption[];

			placeholder?:string;

			noResultsText?:string;

			searchingText?:string;

	};
  dependsOn?: string;

  resolver?: (
      value:any,
      form:any
  )=>SelectOption[];

};

const validators = {
  email: (v: string) =>
    /\S+@\S+\.\S+/.test(v) ? null : t('common.validation.email'),

  required: (v: any) =>
    v ? null : t('common.validation.required'),
};

type CrudFormConfig<T> = {
  el: HTMLElement;
  module: any;
  fields: Field[];
  mode: 'create' | 'edit';
  modalId: string;
  translations: string;
	tabs?: FormTab[];
	tabRenderers?: Record<
		string,
		(container: HTMLElement, context: {
			mode: 'create' | 'edit';
			data: T;
		})  => {
        getValue?: () => any;
    } | void
	>;
	variables?: AvailableVariableGroup[];
	beforeSubmit?: (context: {
			payload: Record<string, any>;
			formData: Record<string, any>;
			data: any;
	}) => Promise<{
			proceed: boolean;
			payload?: Record<string, any>;
	}>;
  getData?: () => T;
  transform?: (payload: any, formData?: FormData) => any; // 🔥 NEW
  onSuccess?: (response: any) => void;
};

export function mountCrudForm<T>(config: CrudFormConfig<T>) {
  const { el, module, fields, mode, modalId, translations, getData, variables, } = config;

  let formData: Record<string, any> = {};

  const definitionRenderers: Record<string, DefinitionRenderer> = {};

  const tabRenderers: Record<
			string,
			{
					getValue?: () => any;
			}
	> = {};

  const componentRegistry = new Map<
      string,
      {
          field: Field;
          component:any;
          type:Field["type"];
      }
  >();

  let currentId: any = null;

  const initialData = getData?.() ?? {};

  if (mode === "edit") {

      currentId = (initialData as any)?.id;

  }

  fields.forEach(field => {

      if (field.type === "definition") {

          formData[field.name] =

              (initialData as any)?.[field.name]

              ?? {};

      } else {

          formData[field.name] =

              (initialData as any)?.[field.name]

              ?? field.default

              ?? "";

      }

  });

  // ---------------------------
  // RENDER
  // ---------------------------

  function render() {

			const form =
					document.createElement('form');

			form.id = 'crud-form';

			form.className =
					'space-y-4';

			form.innerHTML = `
					${
							config.tabs?.length
									? `<div data-form-tabs></div>`
									: `
											<div class="grid grid-cols-6 gap-6">
													${fields.map(renderField).join('')}
											</div>
									`
					}

					${
						variables?.length
							? `
								<div
									class="mt-6"
									data-available-variables
								></div>
							`
							: ''
					}

					<div
							class="items-center
										p-6
										border-t
										border-gray-200
										rounded-b
										dark:border-gray-700"
					>
							<button
									type="submit"
									class="text-white
												bg-primary-700
												hover:bg-primary-800
												focus:ring-4
												focus:ring-primary-300
												font-medium
												rounded-lg
												text-sm
												px-5
												py-2.5
												text-center"
							>
									${
											mode === 'create'
													? t(translations+'.buttons.add')
													: t(translations+'.buttons.edit')
									}
							</button>
					</div>
			`;

			el.innerHTML = '';

			el.appendChild(form);

			const variablesContainer =
				form.querySelector(
					'[data-available-variables]'
				) as HTMLElement | null;

			if (
				variablesContainer &&
				variables?.length
			) {

				renderAvailableVariables({

					container: variablesContainer,

					groups: variables,

					title: t(
						'document-templates.variables.title'
					),

					searchPlaceholder: t(
						'document-templates.variables.search'
					),

					emptyText: t(
						'document-templates.variables.empty'
					),

				});

			}

			if (config.tabs?.length) {

					mountFormTabs(form);

			} else {

					mountComponents(form);

					updateDependentFields();

			}

	}

	function mountFormTabs(form: HTMLFormElement) {

		const container =
			form.querySelector(
				'[data-form-tabs]'
			) as HTMLElement;

		if (!container) return;

		const submitButton =
				form.querySelector(
						'button[type="submit"], input[type="submit"]'
				) as HTMLButtonElement | HTMLInputElement | null;

		const updateSubmitButton =
				(tabId: string) => {

						if (!submitButton) return;

						const disabled =
            		tabId === 'documents';
						submitButton.disabled =
								disabled;

						submitButton.classList.toggle(
								'opacity-50',
								disabled
						);

						submitButton.classList.toggle(
								'cursor-not-allowed',
								disabled
						);

						submitButton.classList.toggle(
								'bg-gray-400',
								disabled
						);

				};

		const tabsRenderer =
				renderFormTabs(
						container,
						config.tabs!,
						config.tabs![0]?.id,
						{
								onTabChange: updateSubmitButton
						}
				);

		updateSubmitButton(
				tabsRenderer.getActiveTab()
		);

		config.tabs!.forEach(tab => {

			const tabContainer =
				tabsRenderer.getContainer(tab.id);

			if (!tabContainer) return;

			const customRenderer =
				config.tabRenderers?.[tab.id];

			if (customRenderer) {

				const renderer =
						customRenderer(
								tabContainer,
								{
										mode,
										data: initialData as T
								}
						);

				if (renderer) {

						tabRenderers[tab.id] =
								renderer;
				}

				return;
		}

			tabContainer.innerHTML = `
				<div class="grid grid-cols-6 gap-6">
					${renderTabFields(tab.id)}
				</div>
			`;

		});

		mountComponents(form);

		updateDependentFields();

	}

	function renderTabFields(
			tabId: string
	) {

			return fields
					.filter(
							field =>
									field.tab === tabId
					)
					.map(renderField)
					.join("");
	}

  function mountComponents( form:HTMLFormElement ){

    fields
    .filter(f=>f.type==="switch")
    .forEach(field=>{
        const switchContainer =
            form.querySelector(

                `[data-form-switch="${field.name}"]`

            ) as HTMLElement;

        if(!switchContainer)
            return;

        mountFormSwitch({

            container:switchContainer,

            value:
                formData[field.name]
                ??
                field.default
                ??
                false,

            onChange(value){

                formData[field.name]=value;

            }

        });

        componentRegistry.set(

            field.name,

            {

                type:"switch",

                field

            }

        );

    });

    fields
    .filter(f=>f.type==="tag-selector")
    .forEach(field=>{

        const container=form.querySelector(

            `[data-tag-selector="${field.name}"]`

        ) as HTMLElement;

        if(!container) return;

        const module = field.component!.module;

        const tagProps = {

          value: formData[field.name] ?? [],

          max: field.component?.max,

          search: module.tagSelector.search,

          create: module.tagSelector.create,

          onChange(tags){

              console.log(

                  "TagSelector changed",

                  field.name,

                  tags

              );

              formData[field.name] = tags;
              updateDependentFields();

          }

      };

      if(field.component?.onCreateRequested){

          tagProps.onCreateRequested = async(text)=>{

              return field.component!.onCreateRequested!(

                  text,

                  field.component!.module

              );

          };

      }

      const selector = renderTagSelector(

          container,

          tagProps

      );

      componentRegistry.set(

          field.name,

          {

              type:"tag-selector",

              field,

              component:selector

          }

      );

    });

		fields
		.filter(f => f.type === "case-people")
		.forEach(field => {

				const container =
						form.querySelector(
								`[data-case-people="${field.name}"]`
						) as HTMLElement;

				if (!container) return;

				const module = field.component!.module;

				const selector =
						renderCasePeopleSelector(

								container,

								{

										value:
												formData[field.name] ?? [],
												
										customerId: formData.customer_id?.[0]?.id,

										search:
												module.tagSelector.search,

										create:
												module.tagSelector.create,

										onCreateRequested:
												field.component?.onCreateRequested,

										relationshipOptions:
												field.component!
														.relationshipOptions
														?? [],

										max:
												field.component?.max,

										placeholder:
												field.component?.placeholder,

										noResultsText:
												field.component?.noResultsText,

										searchingText:
												field.component?.searchingText,

										onChange(people) {

												console.log(
														"Case people changed",
														field.name,
														people
												);

												formData[field.name] =
														people;

												updateDependentFields();

										}

								}

						);

				componentRegistry.set(

						field.name,

						{

								type: "case-people",

								field,

								component: selector

						}

				);

		});

    fields
    .filter(f=>f.type==="select")
    .forEach(field=>{

        const select=form.querySelector(

            `[name="${field.name}"]`

        ) as HTMLSelectElement;

        if(!select)
            return;

        componentRegistry.set(

            field.name,

            {

                field,

                type:"select",

                component:select

            }

        );

    });

    fields
    .filter(f => f.type === "definition")
    .forEach(field => {

        const container = form.querySelector(

            `[data-definition="${field.name}"]`

        ) as HTMLElement;

        if(!container) return;

        const renderer = renderDefinition(

            container,

            module.definitionSchema!,

            translations,

            formData[field.name]

        );

        definitionRenderers[field.name] = renderer;

    });
  }

  function updateDependentFields(){

      for(const field of fields){

          if(

              !field.dependsOn ||

              !field.resolver

          ){

              continue;

          }

          let dependencyValue =

              formData[field.dependsOn];
              

          const options = field.resolver(

              dependencyValue,

              formData

          );

          const registry = componentRegistry.get(

              field.name

          );

          if(

              !registry ||

              registry.type!=="select"

          ){

              continue;

          }

          const select =

              registry.component as HTMLSelectElement;

          select.innerHTML="";

          for(const option of options){

              const opt=document.createElement("option");

              opt.value=String(option.value);

              opt.textContent=t(option.label);

              if(

                  formData[field.name]==option.value

              ){

                  opt.selected=true;

              }

              select.appendChild(opt);

          }

          const firstOption = options[0];

          if(

              !options.some(

                  x=>x.value===formData[field.name]

              )

          ){

              formData[field.name]=

                  firstOption?.value ?? "";

          }

          select.value=String(

              formData[field.name] ?? ""

          );

      }

  }

  function renderField(field: Field) {
    const value = formData[field.name] || '';

    if (field.type === 'select') {
      return `
        <div class="col-span-6 sm:col-span-3">
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">${t(field.label)}</label>
          <select name="${field.name}" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
            ${field.options
              ?.map(
                (opt) => `
                <option value="${opt.value}" ${
                  opt.value === value ? 'selected' : ''
                }>
                  ${t(opt.label)}
                </option>
              `
              )
              .join('')}
          </select>
        </div>
      `;
    }

    if (field.type === 'checkbox') {
      return `
        <div class="col-span-6">
          <label class="flex items-center space-x-2">
            <input type="checkbox" name="${field.name}" ${value ? 'checked' : ''}  />
            <span class="text-sm text-gray-900 dark:text-white">${t(field.label)}</span>
          </label>
        </div>
      `;
    }

    if (field.type === 'switch') {

        return `
            <div class="col-span-6">

                <label
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    ${t(field.label)}
                </label>

                <div
                    data-form-switch="${field.name}"
                ></div>

            </div>
        `;

    }

    if(field.type==="tag-selector"){

			if (
					mode === 'edit' &&
					field.name === 'case_type_id'
			) {

					const selected =
							formData[field.name]?.[0];

					return `
							<div class="col-span-6">

									<label
											class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
											${t(field.label)}
									</label>

									<div
											class="
													shadow-sm
													bg-gray-100
													border
													border-gray-300
													text-gray-900
													sm:text-sm
													rounded-lg
													block
													w-full
													p-2.5
													dark:bg-gray-700
													dark:border-gray-600
													dark:text-white
											"
									>
											${selected?.label ?? ''}
									</div>

							</div>
					`;
			}

			return`

					<div class="col-span-6">

							<label
									class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">

									${t(field.label)}

							</label>

							<div
									data-tag-selector="${field.name}">
							</div>

					</div>

			`;

	}

		if(field.type === "case-people"){

				return `

						<div class="col-span-12">

								<label
										class="
												block
												mb-2
												text-sm
												font-medium
												text-gray-900
												dark:text-white
										"
								>
										${t(field.label)}
								</label>

								<div
										data-case-people="${field.name}">
								</div>

						</div>

				`;

		}

    if (field.type === "definition") {

        return `

            <div class="col-span-12">

                <div
                    data-definition="${field.name}">
                </div>

            </div>

        `;

    }

		if (field.type === 'textarea') {
      return `
        <div class="col-span-12 sm:col-span-6">
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">${t(field.label)}</label>
          <textarea
            name="${field.name}"
            class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          >${value}</textarea>
        </div>
      `;
    }

		if (field.type === 'file') {
				return `
						<div class="col-span-12 sm:col-span-6">
								<label
										class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
										${t(field.label)}
								</label>

								<input
										type="file"
										name="${field.name}"
										class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
								/>
						</div>
				`;
		}
    return `
      <div class="col-span-6 sm:col-span-3">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">${t(field.label)}</label>
        <input 
          type="${field.type}" 
          name="${field.name}" 
          value="${value}"
          class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        />
      </div>
    `;
  }

  function renderErrors(errors: Record<string, string>) {
    let errorBox = el.querySelector('[data-form-errors]') as HTMLElement;

    if (!errorBox) {
      errorBox = document.createElement('div');
      errorBox.setAttribute('data-form-errors', '');
      errorBox.className = 'mb-4 text-sm text-red-600';
      el.prepend(errorBox);
    }

    errorBox.innerHTML = Object.values(errors)
      .map(e => `<div>${e}</div>`)
      .join('');
  }

  function clearErrors() {
    const errorBox = el.querySelector('[data-form-errors]');
    if (errorBox) errorBox.remove();
  }

  // ---------------------------
  // EVENTS
  // ---------------------------

  el.onsubmit = async (e) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLElement;

    if (!lockElement(submitBtn)) return; // evita doble submit

    const fd = new FormData(form);

    const errors: Record<string, string> = {};

    const payload: Record<string, any> = {};

    Object.entries(definitionRenderers).forEach(

        ([field, renderer]) => {

            formData[field] = renderer.getValue();

        }

    );

    /*const activeFields = fields.filter(
      f => !(mode === 'create' && f.name === 'status')
    );*/

    clearErrors();

    fields.forEach((f) => {
      let value;

      if(f.type==='switch'){

          value = formData[f.name] ?? false;

      }
      else{

          value = fd.get(f.name) ?? '';

      }

      if (f.required) {
        const err = validators.required(value);
        if (err) errors[f.name] = err;
      }

      if (f.type === 'email') {
        const err = validators.email(value as string);
        if (err) errors[f.name] = err;
      }

      if (f.validate) {
        const err = f.validate(value);
        if (err) errors[f.name] = err;
      }

      if (f.type === 'checkbox') {
        value = fd.get(f.name) ? 1 : 0;
      }

      if (f.type === "tag-selector") {

          value = formData[f.name] ?? [];

      }

			if (f.type === "case-people") {

					value = formData[f.name] ?? [];

			}

      if (f.type === "definition") {

          value = formData[f.name];

      }

      if( f.type==='switch' ){

          value = formData[f.name] ?1 :0;

      }

      payload[f.name] = value;
    });console.log("TABRENDERS", tabRenderers);

		if (tabRenderers.data?.getValue) {

				payload.data =
						tabRenderers.data.getValue();

		}

    if (Object.keys(errors).length) {
      renderErrors(errors);
      unlockElement(submitBtn);
      return;
    }
    console.log("PAYLOAD", payload);
		let finalPayload = payload;

		if (config.transform) {
      console.log("FORM DATA", formData);
      console.log("PAYLOAD", payload);
			finalPayload = config.transform(payload, fd);
		}

		if (config.beforeSubmit) {

			const result =
					await config.beforeSubmit({
							payload: finalPayload,
							formData,
							data: getData?.()
					});

			if (!result.proceed) {
					unlockElement(submitBtn);
					return;
			}

			if (result.payload) {
					finalPayload = result.payload;
			}
	}
    console.log("FINAL PAYLOAD", finalPayload);
    try {
      if (mode === 'create') {
        
        const response = await module.createItem(finalPayload);
        showSuccess(
          t(`common.messages.created`)
        );
        config.onSuccess?.(response);
      } else {
        await module.updateItem(currentId, finalPayload);        
        showSuccess(
          t(`common.messages.updated`)
        );
      }
      modalController.close(config.modalId);
      

      form.reset();
    } catch (e) {
      console.error('form error', e);

      showError(
        e?.message || t('common.messages.error')
      );

      renderErrors({
        api: e?.message || 'Unexpected error'
      });
    } finally {
      unlockElement(submitBtn); // 🔥 SIEMPRE liberar
    }
  };

  i18nVersion.subscribe(() => {
    render();
  });

  render();
}
