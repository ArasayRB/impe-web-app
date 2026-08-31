// cases.types.ts

export interface Case {
  id: number;
  title: string;
  status: string;
  created_at: string;
}

export interface CaseFilters {
  page?: number;
  search?: string;
  deviceHash?: string;
}

export interface CaseResponse {
  data: Case[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

export interface CaseWorkflowRequirement {
    key: string;
    label: string;
    completed: boolean;
}

export interface CaseWorkflowForceMetadata {
    forced: boolean;
    from_status: string | null;
    to_status: string | null;
    from_step: string | null;
    from_step_label: string | null;
    to_step: string | null;
    to_step_label: string | null;
    requirements: CaseWorkflowRequirement[];
}

export interface CaseWorkflowForceDetail {
    description: string;
    metadata: CaseWorkflowForceMetadata;
    created_at: string;
    created_by: number | null;
}

export type CaseWorkflowStepStatus =
    'pending' |
    'active' |
    'completed';

export interface CaseWorkflowStep {
    key: string;
    label: string;
    status: CaseWorkflowStepStatus;
    started_at: string | null;
    finished_at: string | null;
    forced: boolean;
    force_details: CaseWorkflowForceDetail[];
}

export interface CaseWorkflow {
    process_starts_on: string | null;
    current_step: string | null;
    paused: boolean;
    steps: CaseWorkflowStep[];
}

export interface CaseWorkflowResponse {
    success: boolean;
    message: string;
    data: {
        case: {
            id: number;
            case_number: string;
            status: string;
        };
        workflow: CaseWorkflow;
    };
}
