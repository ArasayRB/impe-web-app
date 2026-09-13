import { t } from '@/lib/i18n/i18n';
import { createCrudSwitch } from '@/lib/crud/components/createCrudSwitch';
import { toggleCustomerPortal } from './customers.store';

export const customerColumns = [
	{
		key: 'name',
		label: 'customers.columns.name',
	},
	{
		key: 'email',
		label: 'customers.columns.email',
	},
	{
		key: 'address',
		label: 'customers.columns.address',
	},
	{
		key: 'phone',
		label: 'customers.columns.phone',
	},
	{
		key: 'portal_access',
		label: 'customers.columns.portal_access',

		component: createCrudSwitch({

			async onChange(value, row: any) {

				await toggleCustomerPortal(
					row.id,
					value
				);

			}

		})
	},
	{
		key: 'notes',
		label: 'customers.columns.notes',
	},
];
