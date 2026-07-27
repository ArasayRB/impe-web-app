export function sortAnalyticsTable(
    column: string,
    direction: 'asc' | 'desc' | null
){

    window.dispatchEvent(

        new CustomEvent(

            'analytics:sort',

            {

                detail:{
                    column,
                    direction
                }

            }

        )

    );

}
