import type { Field } from '@/lib/createCrudForm';

export const customerFields: Field[] = [
  { name: 'name', label: 'customers.fields.name', type: 'text', required: true },
  { name: 'email', label: 'customers.fields.email', type: 'email', required: true },
  { name: 'address', label: 'customers.fields.address', type: 'text' },
  { name: 'phone', label: 'customers.fields.phone', type: 'tel' },
	{name: 'birthdate',label: 'customers.fields.birthdate',type: 'date'},
	{
			name: 'gender',
			label: 'customers.fields.gender',
			type: 'select',
			options: [
					{value: 'male',label: 'customers.fields.gender_options.male'},
					{value: 'female',label: 'customers.fields.gender_options.female'},
					{value: 'other',label: 'customers.fields.gender_options.other'}
			]
	},
	{name: 'nationality',label: 'customers.fields.nationality',type: 'text'},
	{name: 'passport',label: 'customers.fields.passport',type: 'text'},
  { name: 'notes', label: 'customers.fields.notes', type: 'textarea' },
  { name: 'with_account', label: 'customers.fields.with_account', type: 'checkbox' },
]
