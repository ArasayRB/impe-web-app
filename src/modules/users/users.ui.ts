// src/modules/users/users.ui.ts

import { 
	usersModule,
	getUserPermissions,
  assignUserPermissions 
} from './users.store';

import { userColumns } from './users.columns.config';

import {
	fetchPermissions,
	statePermissions
} from '@/modules/permissions/permissions.store';

import { modalController } from '@/lib/modal.controller';

import { mountCrud } from '@/lib/createCrudUi';

import { initSite } from '@/lib/site.store';
import { debounce } from '@/lib/debounce';

import {
	fetchRoles,
	getRolePermissions,
	stateRoles
} from '@/modules/roles/roles.store';


let currentFilters: Record<string, any> = {};

async function ensurePermissionsLoaded() {

	const state = statePermissions();

	if (state.data && state.data.length) {
		return;
	}

	await fetchPermissions();
}

function renderPermissionItem(
	permission: any,
	options: {
		checked: boolean;
		disabled?: boolean;
		inherited?: boolean;
	}
) {

	const {
		checked,
		disabled = false,
		inherited = false
	} = options;

	return `
		<label
			class="
				flex items-center gap-3
				p-3
				rounded-lg
				border
				border-gray-200
				dark:border-gray-700
				${disabled
					? 'bg-gray-100 dark:bg-gray-700/50 cursor-not-allowed opacity-75'
					: 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer'
				}
			"
		>

			<input
				type="checkbox"
				value="${permission.id}"
				data-permission-id="${permission.id}"
				class="
					w-4 h-4
					text-primary-600
					bg-gray-100
					border-gray-300
					rounded
					focus:ring-primary-500
					dark:focus:ring-primary-600
					dark:ring-offset-gray-800
					dark:bg-gray-700
					dark:border-gray-600
					${disabled
						? 'cursor-not-allowed opacity-60'
						: 'cursor-pointer'
					}
				"
				${checked ? 'checked' : ''}
				${disabled ? 'disabled' : ''}
			>

			<div class="min-w-0 flex-1">

				<div class="flex items-center gap-2">

					<span
						class="text-sm font-medium text-gray-900 dark:text-white"
					>
						${permission.name}
					</span>

					${
						permission.is_administrative
							? `
								<span
									class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
								>
									Administrative
								</span>
							`
							: ''
					}

				</div>

				${
					inherited
						? `
							<div
								class="mt-1 text-xs text-gray-500 dark:text-gray-400"
							>
								Inherited from role
							</div>
						`
						: ''
				}

			</div>

		</label>
	`;
}

async function openPermissionsForm(row: any) {

	const modal = document.getElementById(
		'permissions-users-modal'
	);

	if (!modal) return;

	const roleContainer =
		modal.querySelector(
			'[data-role-permissions-container]'
		);

	const userContainer =
		modal.querySelector(
			'[data-user-permissions-container]'
		);

	if (!roleContainer || !userContainer) {
		return;
	}

	const userLabel =
		modal.querySelector(
			'[data-modal-user]'
		);

	if (userLabel) {
		userLabel.textContent =
			`${row.name} · ${row.email}`;
	}


	/*
	|--------------------------------------------------------------------------
	| Reset
	|--------------------------------------------------------------------------
	*/

	roleContainer.innerHTML = `
		<div class="col-span-full text-sm text-gray-500">
			Loading role permissions...
		</div>
	`;

	userContainer.innerHTML = `
		<div class="col-span-full text-sm text-gray-500">
			Loading user permissions...
		</div>
	`;


	try {

		/*
		|--------------------------------------------------------------------------
		| Load permissions catalog
		|--------------------------------------------------------------------------
		*/

		let permissionsState =
			statePermissions();

		if (
			!permissionsState.data ||
			!permissionsState.data.length
		) {
			await fetchPermissions();

			permissionsState =
				statePermissions();
		}

		const availablePermissions =
			permissionsState.data ?? [];


		/*
		|--------------------------------------------------------------------------
		| Find user's role
		|--------------------------------------------------------------------------
		*/

		const rolesState =
			stateRoles();

		const role =
			rolesState.data?.find(
				(item: any) =>
					item.name === row.role
			);

		if (!role) {

			throw new Error(
				`Role "${row.role}" not found`
			);
		}


		/*
		|--------------------------------------------------------------------------
		| Load role permissions + direct user permissions
		|--------------------------------------------------------------------------
		*/

		const [
			roleResponse,
			userResponse
		] = await Promise.all([

			getRolePermissions(
				role.id
			),

			getUserPermissions(
				row.id
			)

		]);console.log('roleResponse',roleResponse, 'userResponse',userResponse)


		const rolePermissions =
			roleResponse?.data?.data ?? [];

		const userPermissions =
			userResponse?.data?.data ??
			[];


		/*
		|--------------------------------------------------------------------------
		| Create lookup sets
		|--------------------------------------------------------------------------
		*/

		const rolePermissionIds =
			new Set(
				rolePermissions.map(
					(permission: any) =>
						permission.id
				)
			);

		const userPermissionIds =
			new Set(
				userPermissions.map(
					(permission: any) =>
						permission.id
				)
			);

		console.log('ROLE PERMISSIONS:', rolePermissions);
		console.log('ROLE PERMISSIONS LENGTH:', rolePermissions.length);
		console.log('ROLE CONTAINER:', roleContainer);


		/*
		|--------------------------------------------------------------------------
		| Role permissions
		|--------------------------------------------------------------------------
		|
		| These are inherited from the role.
		| They are displayed but cannot be changed here.
		|
		*/

		roleContainer.innerHTML =
  availablePermissions
    .map((permission: any) => {
      const assigned =
        rolePermissionIds.has(permission.id);

      return renderPermissionItem(
        permission,
        {
          checked: assigned,
          disabled: true
        }
      );
    })
    .join('');

		console.log(
			'ROLE CONTAINER HTML:',
			roleContainer.innerHTML
		);


		/*
		|--------------------------------------------------------------------------
		| User permissions
		|--------------------------------------------------------------------------
		|
		| Direct permissions belong specifically
		| to this user.
		|
		*/

		userContainer.innerHTML =
  availablePermissions
    .map((permission: any) => {
      const isDirect =
        userPermissionIds.has(permission.id);

      const inherited =
        rolePermissionIds.has(permission.id);

      return renderPermissionItem(
        permission,
        {
          checked: isDirect,
          disabled: inherited,
          inherited
        }
      );
    })
    .join('');


		/*
		|--------------------------------------------------------------------------
		| Tabs
		|--------------------------------------------------------------------------
		*/

		const roleTab =
			modal.querySelector(
				'[data-permissions-tab="role"]'
			) as HTMLElement | null;

		const userTab =
			modal.querySelector(
				'[data-permissions-tab="user"]'
			) as HTMLElement | null;

		const rolePanel =
			modal.querySelector(
				'[data-permissions-role]'
			) as HTMLElement | null;

		const userPanel =
			modal.querySelector(
				'[data-permissions-user]'
			) as HTMLElement | null;

		const saveButton =
			modal.querySelector(
				'[data-save-permissions]'
			) as HTMLElement | null;

			if (saveButton) {
				const newSaveButton =
					saveButton.cloneNode(true) as HTMLElement;

				saveButton.replaceWith(newSaveButton);

				newSaveButton.addEventListener(
					'click',
					async () => {
						const permissionIds = Array.from(
							userContainer.querySelectorAll<HTMLInputElement>(
								'input[data-permission-id]:checked:not(:disabled)'
							)
						).map(
							(input) =>
								Number(input.dataset.permissionId)
						);

						const permissions =
							availablePermissions
								.filter((permission: any) =>
									permissionIds.includes(
										permission.id
									)
								)
								.map(
									(permission: any) =>
										permission.name
								);

						try {
							newSaveButton.setAttribute(
								'disabled',
								'true'
							);

							await assignUserPermissions(
								row.id,
								{
									permissions
								}
							);

							modalController.close(
								'permissions-users-modal'
							);
						} catch (error) {
							console.error(
								'Error saving user permissions',
								error
							);
						} finally {
							newSaveButton.removeAttribute(
								'disabled'
							);
						}
					}
				);
			}
			saveButton?.addEventListener('click', async () => {
				const permissionIds = Array.from(
					userContainer.querySelectorAll<HTMLInputElement>(
						'input[data-permission-id]:checked:not(:disabled)'
					)
				).map((input) => Number(input.dataset.permissionId));

				const permissions = availablePermissions
					.filter((permission: any) =>
						permissionIds.includes(permission.id)
					)
					.map((permission: any) => permission.name);

				try {
					saveButton.setAttribute('disabled', 'true');

					await assignUserPermissions(
						row.id,
						{
							permissions
						}
					);

					modalController.close(
						'permissions-users-modal'
					);
				} catch (error) {
					console.error(
						'Error saving user permissions',
						error
					);
				} finally {
					saveButton.removeAttribute('disabled');
				}
			});


		const activateTab = (
			tab: 'role' | 'user'
		) => {

			const roleActive =
				tab === 'role';

			rolePanel?.classList.toggle(
				'hidden',
				!roleActive
			);

			userPanel?.classList.toggle(
				'hidden',
				roleActive
			);

			roleTab?.classList.toggle(
				'text-primary-600',
				roleActive
			);

			roleTab?.classList.toggle(
				'border-primary-600',
				roleActive
			);

			roleTab?.classList.toggle(
				'text-gray-500',
				!roleActive
			);

			roleTab?.classList.toggle(
				'border-transparent',
				!roleActive
			);

			userTab?.classList.toggle(
				'text-primary-600',
				!roleActive
			);

			userTab?.classList.toggle(
				'border-primary-600',
				!roleActive
			);

			userTab?.classList.toggle(
				'text-gray-500',
				roleActive
			);

			userTab?.classList.toggle(
				'border-transparent',
				roleActive
			);

			/*
			 * Save only makes sense on User Permissions.
			 */
			if (saveButton) {
				saveButton.classList.toggle(
					'hidden',
					roleActive
				);
			}
		};


		roleTab?.addEventListener(
			'click',
			() => activateTab('role')
		);

		userTab?.addEventListener(
			'click',
			() => activateTab('user')
		);


		/*
		|--------------------------------------------------------------------------
		| Open modal on Role tab
		|--------------------------------------------------------------------------
		*/

		activateTab('role');

		modalController.open(
			'permissions-users-modal'
		);

	} catch (error) {

		console.error(
			'Error loading user permissions',
			error
		);

		roleContainer.innerHTML = `
			<div
				class="col-span-full p-4 text-sm text-red-600 bg-red-50 rounded-lg"
			>
				Unable to load role permissions.
			</div>
		`;

		userContainer.innerHTML = `
			<div
				class="col-span-full p-4 text-sm text-red-600 bg-red-50 rounded-lg"
			>
				Unable to load user permissions.
			</div>
		`;

		modalController.open(
			'permissions-users-modal'
		);
	}
}

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
			openPermissionsForm(row);
		},


		getFilters:
			() =>
				currentFilters,

	});


	mountUserSearch();
}
