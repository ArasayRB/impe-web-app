// src/modules/users/users.ui.ts

import { usersModule } from './users.store';
import { userColumns } from './users.columns.config';

import { mountCrud } from '@/lib/createCrudUi';

import { initSite } from '@/lib/site.store';
import { debounce } from '@/lib/debounce';

import {
	fetchRoles,
	stateRoles
} from '@/modules/roles/roles.store';


let currentFilters: Record<string, any> = {};


function mountUserSearch() {

	const form =
		document.querySelector(
			'[data-form="users-search"]'
		);

	if (!form) {
		return;
	}

	// Avoid duplicates
	if ((form as any)._mounted) {
		return;
	}

	(form as any)._mounted = true;

	const input =
		form.querySelector(
			'[data-input]'
		) as HTMLInputElement;

	if (!input) {
		return;
	}


	// Init from URL

	const params =
		new URLSearchParams(
			window.location.search
		);

	const initialSearch =
		params.get('search');


	if (initialSearch) {

		input.value =
			initialSearch;

		currentFilters.search =
			initialSearch;

		usersModule.fetch(
			currentFilters
		);
	}


	const search =
		debounce(
			async (q: string) => {

				if (!q) {

					delete currentFilters.search;

				} else {

					currentFilters.search =
						q;
				}


				// URL

				const params =
					new URLSearchParams(
						window.location.search
					);


				if (q) {

					params.set(
						'search',
						q
					);

				} else {

					params.delete(
						'search'
					);
				}


				window.history.replaceState(
					{},
					'',
					`?${params}`
				);


				// Fetch

				try {

					await usersModule.fetch(
						currentFilters
					);

				} catch (error) {

					console.error(
						'users search error',
						error
					);
				}

			},
			300
		);


	input.addEventListener(
    'input',
    (event) => {

        const inputElement =
            event.target as HTMLInputElement;

        const value =
            inputElement.value;

        search(value);
    }
);
}


async function ensureRolesLoaded() {

	const state =
		stateRoles();

	if (
		state.data &&
		state.data.length
	) {
		return;
	}

	await fetchRoles();
}


export async function mountUsers(
	el: HTMLElement
) {

	const root =
		document.getElementById(
			'users-root'
		);


	if (root?.dataset.site) {

		initSite(
			JSON.parse(
				root.dataset.site
			)
		);
	}


	// Roles are required by the
	// inline role selector.

	await ensureRolesLoaded();


	const columnsData =
		userColumns;


	await mountCrud({

		el,

		module:
			usersModule,

		columns:
			columnsData,

		translations:
			'users',


		export: {

			filename:
				'users',

			columns:
				columnsData
		},


		actions: {

			add: false,

			edit: false,

			delete: false,

			info: false,
			
		  permissions: true,

		},


		permissions: {

			create: undefined,

			update:
				'users.update',

			delete: undefined,

		},

		onPermissions: (row) => {
			// aquí abriremos el modal/panel de permisos
		},


		getFilters:
			() =>
				currentFilters,

	});


	mountUserSearch();
}
