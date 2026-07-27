// src/lib/analytics/chartEvents.ts
export function showAnalyticsTable(
    chart: string,
    value: string,
    rows: any[]
) {

    window.dispatchEvent(

        new CustomEvent(
            'analytics:table',
            {
                detail: {
                    chart,
                    value,
                    rows
                }
            }
        )

    );

}

export function selectAnalytics(
    analyticsId: string,
    value: string | null = null
) {

    window.dispatchEvent(

        new CustomEvent(
            'analytics:select',
            {
                detail: {
                    analyticsId,
                    value
                }
            }
        )

    );

}
