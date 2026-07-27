export function renderProfile(user: any) {
  return `
    <div class="flex items-center ml-3">
      <button
        type="button"
        class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
        data-dropdown-toggle="dropdown-user"
      >
        <img
          class="w-8 h-8 rounded-full"
          src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          alt="user photo"
        />
      </button>

      <div
        id="dropdown-user"
        class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow"
      >
        <div class="px-4 py-3">
          <p class="text-sm">${user?.name}</p>
          <p class="text-sm font-medium truncate">${user?.email}</p>
        </div>

        <ul class="py-1">
          <li>
            <a href="/dashboard" class="block px-4 py-2 text-sm hover:bg-gray-100">
              Dashboard
            </a>
          </li>
            <li>
                <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem">Settings</a
                >
            </li>
            <li>
                <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem">Earnings</a
                >
            </li>
            <li>
                <a
                    href="#"
                    data-action="logout"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem">Sign out</a
                >
            </li>
          </li>
        </ul>
      </div>
    </div>
  `;
}
