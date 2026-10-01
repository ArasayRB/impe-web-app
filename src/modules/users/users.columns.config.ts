// src/modules/users/users.columns.config.ts

import { createCrudSelect } from '@/lib/crud/components/createCrudSelect';

import {
	updateUserRole
} from './users.store';

import {
	stateRoles
} from '@/modules/roles/roles.store';

export const userColumns = [
	{
		key: 'name',
		label: 'users.columns.name',
	},
	{
		key: 'email',
		label: 'users.columns.email',
	},
	{
		key: 'role',
		label: 'users.columns.role',

		component: createCrudSelect({

			options: () => {

				const state =
					stateRoles();

				return (state.data ?? []).map(
					(role: any) => ({
						value: role.name,
						label: role.name,
					})
				);
			},

			async onChange(value, row: any) {

				if (
					!value ||
					value === row.role
				) {
					return;
				}

				await updateUserRole(
					row.id,
					{
						role: value
					}
				);
			}

		})
	},
	{
		key: 'created_at',
		label: 'users.columns.created_at',

		render: (value: string) => {

			if (!value) {
				return '';
			}

			return value
				.replace('T', ' ')
				.slice(0, 16);
		}
	},
];
