import type { Field } from '@/lib/createCrudForm';

export const inviteFields: Field[] = [
	{
		name: 'email',
		label: 'users.fields.email',
		type: 'email',
		required: false,
	},
	{
		name: 'role',
		label: 'users.fields.role',
		type: 'select',
		required: true,
		options: [
			{
				value: 'admin',
				label: 'users.roles.admin',
			},
			{
				value: 'owner',
				label: 'users.roles.owner',
			},
			{
				value: 'employee',
				label: 'users.roles.employee',
			},
		],
	},
];
