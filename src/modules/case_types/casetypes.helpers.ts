import type { SelectOption } from "@/lib/createCrudForm";
import type { TagItem } from "@/ui/TagSelector/types";

export function getCaseTypeStatusOptions(
    caseTypeSelection: TagItem[] = []
): SelectOption[] {

    const caseType = caseTypeSelection?.[0]?.data;

    if (!caseType) {

        return [];

    }

    return (caseType.statuses ?? []).map(status => ({

        value: status.key,

        label: status.label

    }));

}