// src/lib/crud/components/createCrudSelect.ts

import type { CrudCellComponent } from '../crudColumn';

export interface CrudSelectOption {
	value: string;
	label: string;
}

export interface CrudSelectProps<T> {
	options:
		| CrudSelectOption[]
		| (() => CrudSelectOption[]);

	disabled?: boolean;

	onChange?: (
		value: string,
		row: T
	) => void | Promise<void>;
}

export function createCrudSelect<T>(
	props: CrudSelectProps<T>
): CrudCellComponent<T> {
	return {
		mount(container, value, row) {

			const currentValue = value ?? '';

			const options =
				typeof props.options === 'function'
					? props.options()
					: props.options;

			const select =
				document.createElement('select');

			select.className = [
				'form-select',
				'form-select-sm',
				'rounded-pill',
				'px-3',
				'py-1',
				'border',
				'border-gray-200',
				'bg-white',
				'text-sm',
				'font-medium',
				'text-gray-700',
				'shadow-sm',
				'focus:border-primary',
				'focus:ring-2',
				'focus:ring-primary/20',
			].join(' ');

			if (props.disabled) {
				select.disabled = true;
			}

			options.forEach((option) => {

				const optionElement =
					document.createElement('option');

				optionElement.value =
					option.value;

				optionElement.textContent =
					option.label;

				optionElement.selected =
					option.value === currentValue;

				select.appendChild(
					optionElement
				);
			});

			select.addEventListener(
				'change',
				async () => {

					const nextValue =
						select.value;

					if (
						nextValue === currentValue
					) {
						return;
					}

					try {

						await props.onChange?.(
							nextValue,
							row
						);

					} catch (error) {

						select.value =
							currentValue;

						throw error;
					}
				}
			);

			container.appendChild(select);
		}
	};
}
