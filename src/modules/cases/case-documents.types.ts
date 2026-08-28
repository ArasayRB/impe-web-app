// src/modules/cases/case-documents.types.ts
export interface CaseDocument {

	id: number;

	entity_type: string;

	entity_id: number;

	document_key: string;

	provider: string;

	disk: string;

	path: string;

	original_name: string;

	mime: string;

	size: number;

	status: string;

	uploaded_by: number | null;

	validated_by: number | null;

	validated_at: string | null;

	checksum: string | null;

	version: number;

	metadata: {

		url?: string;

		generated?: boolean;

		template_id?: number;

		template_name?: string;

	};

	deleted_at: string | null;

	created_at: string;

	updated_at: string;
}

export interface CaseDocumentCategory {

	key: string;

	label: string;

	required: boolean;

	required_to_finish: boolean;

	multiple: boolean;

	min_files: number;

	max_files: number;

	accepted_types: string[];
}
