// src/modules/casetypes.status.mapper.ts
export interface CaseStatus {

    key: string;

    label: string;

    color: string;

    client_visible: boolean;

    final: boolean;

}

export function mapCaseStatuses(
    caseType: any
): CaseStatus[]{

    if(!caseType){

        return [];

    }

    return Array.isArray(caseType.statuses)

        ? caseType.statuses

        : [];

}