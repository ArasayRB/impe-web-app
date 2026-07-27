// src/lib/analytics/cardIcons.ts

export function cardIcons(icon: string | undefined): string|undefined {

	if(icon){
    switch (icon) {

        case 'briefcase':

            return `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2m5 0H4v13a1 1 0 001 1h14a1 1 0 001-1V6z"/>
                </svg>
            `;

        case 'activity':

            return `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
            `;

        case 'alert-circle':

            return `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke-width="2"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke-width="2"/>
                    <circle cx="12" cy="16" r="1"/>
                </svg>
            `;

        case 'git-branch':

            return `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 3v12m0 0a3 3 0 106 0V9a3 3 0 116 0v12"/>
                </svg>
            `;
        
        case 'clock':

            return `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke-width="2"
                    />
                    <polyline
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        points="12 7 12 12 15 14"
                    />
                </svg>
            `;

        case 'users':

            return `
                <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8zm6 0a3 3 0 100-6 3 3 0 000 6z"
                    />
                </svg>
            `;

        case 'user-plus':

            return `
                <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 20H4v-2a4 4 0 014-4h3a4 4 0 014 4v2zM10 10a4 4 0 100-8 4 4 0 000 8zm8-3v6m-3-3h6"
                    />
                </svg>
            `;

        case 'folder-users':

            return `
                <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                    />
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 15a2 2 0 100-4 2 2 0 000 4zm6-1a2 2 0 100-4m-8 5a3 3 0 016 0m2-1a3 3 0 013 3"
                    />
                </svg>
            `;

        case 'user-minus':

            return `
                <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 20H4v-2a4 4 0 014-4h3a4 4 0 014 4v2zM10 10a4 4 0 100-8 4 4 0 000 8zm5 1h6"
                    />
                </svg>
            `;

        case 'bar-chart':

            return `
                <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 19V5m0 14h16M8 17v-5m4 5V7m4 10v-8"
                    />
                </svg>
            `;

        default:

            return '';

    }
	}

}
