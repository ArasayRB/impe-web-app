// src/lib/analytics/tableController.ts

function shouldScrollToTable(): boolean {

    return window.matchMedia(
        '(max-width: 1279px)'
    ).matches;

}

export function showTable(
    root: HTMLElement,
    tableId: string
) {

    root
        .querySelectorAll('[data-table-id]')
        .forEach(table => {

            (table as HTMLElement).style.display = 'none';

        });

    const active =
        root.querySelector(
            `[data-table-id="${tableId}"]`
        );

    if (!active) {
        return;
    }

    (active as HTMLElement).style.display =
        'block';
				
		/*
    * On small screens the table is rendered below
    * the charts, so scroll to the active table.
    *
    * On desktop charts and table are displayed
    * side by side, therefore no automatic scroll
    * should occur.
    */

    if ( shouldScrollToTable() ) {

        requestAnimationFrame(() => {

            active.scrollIntoView({

                behavior: 'smooth',

                block: 'start'

            });

        });

    }
}
