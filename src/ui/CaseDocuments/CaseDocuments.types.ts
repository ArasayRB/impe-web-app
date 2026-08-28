// src/ui/CaseDocuments/CaseDocuments.types.ts
export interface CaseDocumentCategory {
    key: string;
    label: string;
    required?: boolean;
    required_to_finish?: boolean;
    multiple?: boolean;
    min_files?: number;
    max_files?: number;
    accepted_types?: string[];
}

export interface CaseDocument {
    id: number;
    document_key: string;
    original_name: string;
    mime: string;
    size: number;
    status: string;
    metadata?: {
        url?: string;
        generated?: boolean;
        template_id?: number;
        template_name?: string;
    };
    created_at: string;
}

export interface CaseDocumentsProps {
    container: HTMLElement;
    caseId: number;
    caseType: any;
		documentTemplates: any[];
}
