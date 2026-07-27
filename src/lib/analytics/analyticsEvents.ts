let analyticsSelectionListener =
    false;

export function registerAnalyticsSelection(
    module: any
) {

    if (
        analyticsSelectionListener
    ) {

        return;

    }

    analyticsSelectionListener =
        true;

    window.addEventListener(

        'analytics:select',

        (e: any) => {

            const {
                analyticsId,
                value
            } = e.detail;

            module.setUiState({

                activeAnalyticsId:
                    analyticsId,

                activeAnalyticsValue:
                    value

            });

        }

    );

}