
import { t } from '@/lib/i18n/i18n';

export interface CaseWorkflowValidationResult {
    valid: boolean;
    message?: string;
    requirement?: string;
    invalidTransition?: boolean;
}

export function validateCaseWorkflowStatus(
    definition: any,
    requestedStatus: string
): CaseWorkflowValidationResult {

    const steps =
        definition?.workflow?.steps ?? [];

    const currentIndex =
        steps.findIndex(
            (step: any) =>
                step.status === 'active'
        );

    if (currentIndex === -1) {

        return {
            valid: false,
            invalidTransition: true,
            message: 'No active workflow step.'
        };
    }

    const currentStep =
        steps[currentIndex];

    /*
    * The requested status must finish
    * the current step.
    */
    if (
        !(
            currentStep.ends_on ?? []
        ).includes(requestedStatus)
    ) {

        return {
            valid: false,
            invalidTransition: true,
            message:
                `'${requestedStatus}' ${t('cases.messages.invalid_transition')}`
        };
    }

    /*
    * Workflow requirements.
    */
    const requirements =
        currentStep.requirements ?? {};

    for (
        const [key, requirement]
        of Object.entries(requirements) as any
    ) {

        if (
            !requirement?.required_to_finish
        ) {
            continue;
        }

        const completed =
            definition?.[key]?.completed ?? false;

        if (!completed) {

            return {
                valid: false,
                requirement: key,
                invalidTransition: false,
                message:
                    `'${key}' ${t('cases.messages.requirement_not_complete')}`
            };
        }
    }

    return {
        valid: true
    };
}
