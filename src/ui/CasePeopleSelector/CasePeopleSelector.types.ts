import type { TagItem } from "@/ui/TagSelector/TagSelector.types";

export interface CasePersonRelationshipOption {

    value: string;

    label: string;

}

export interface CasePersonItem {

    person_id: number;

    label: string;

    relationship: string;

}

export interface CasePeopleSelectorProps {

    value: CasePersonItem[];

		customerId?: number;

    search(
        text: string
    ): Promise<TagItem[]>;

		create?(
				text: string
		): Promise<TagItem>;

		onCreateRequested?(
				text: string
		): Promise<TagItem | undefined>;

		createText?(
				text: string
		): string;

    relationshipOptions: CasePersonRelationshipOption[];

    placeholder?: string;

    noResultsText?: string;

    searchingText?: string;

    max?: number;

    onChange?(
        value: CasePersonItem[]
    ): void;

}
