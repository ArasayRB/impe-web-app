// src/modules/cases/cases.form.config.ts
import type { Field } from '@/lib/createCrudForm';
import { getCaseTypeStatusOptions } from "@/modules/case_types/casetypes.helpers";
import { casePersonRelationshipOptions } from "./cases.relationships";

export const caseFormTabs = [
    {
        id: "general",
        label: "cases.tabs.general"
    },
    {
        id: "people",
        label: "cases.tabs.people"
    },
    {
        id: "documents",
        label: "cases.tabs.documents"
    }
];

export const caseFields: Field[] = [
	
	{
			name:"customer_id",

			label:"cases.fields.customer",

			type:"tag-selector",
      
			tab: "general",

			component:{
					module:"customers",

					max:1


			}

	},
	{
			name: "related_people",

			label: "cases.fields.related_people",

			type: "case-people",

			tab: "people",

			component: {

					module:"customers",

					relationshipOptions:
            casePersonRelationshipOptions

			}

	},
	{
			name: 'external_email_case',
			label: 'cases.fields.external_email_case',
			type: 'email',      
			tab: "general"
	},

	{
			name: 'enable_inbound_email',
			label: 'cases.fields.enable_inbound_email',
			type: 'switch',      
			tab: "general",
			default: false
	},
	{ 
		name: 'description',
		label: 'cases.fields.description',
		type: 'textarea',      
		tab: "general" 
	},
	{
		name: 'title',
		label: 'cases.fields.title',
		type: 'text',     
		tab: "general",
		required: true
	},
	
	{

        name:"case_type_id",

        label:"cases.fields.category",

        type:"tag-selector",      
			
				tab: "general",

        component:{
			module:"caseTypes",

            max:1


        }

    },
	{
		name: 'status',
		label: 'cases.fields.status',
		type: 'select',      
		tab: "general",	
		dependsOn:"case_type_id",
		resolver(caseType){

			return getCaseTypeStatusOptions(caseType);

		},
		options: [
			
		],
	}
]
