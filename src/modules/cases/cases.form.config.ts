import type { Field } from '@/lib/createCrudForm';
import { getCaseTypeStatusOptions } from "@/modules/case_types/casetypes.helpers";

export const caseFields: Field[] = [
	
	{

        name:"customer_id",

        label:"cases.fields.customer",

        type:"tag-selector",

        component:{
			module:"customers",

            max:1


        }

    },
	{ 
		name: 'description',
		label: 'cases.fields.description',
		type: 'textarea' 
	},
	{
		name: 'title',
		label: 'cases.fields.title',
		type: 'text',
		required: true
	},
	
	{

        name:"case_type_id",

        label:"cases.fields.category",

        type:"tag-selector",

        component:{
			module:"caseTypes",

            max:1


        }

    },
	{
		name: 'status',
		label: 'cases.fields.status',
		type: 'select',	
		dependsOn:"case_type_id",
		resolver(caseType){

			return getCaseTypeStatusOptions(caseType);

		},
		options: [
			
		],
	}
]
