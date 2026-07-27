// src/modules/case_types/casetypes.form.config.ts
import type { Field } from '@/lib/createCrudForm';

export const casetypesFields: Field[] = [
  { name: 'name', label: 'casetypes.fields.name', type: 'text', required: true },
  {
      name:'active',

      label:'casetypes.fields.active',

      type:'switch',

      default:true
  },
	{
		name: "definition",

		label: "",

		type: "definition",

		component: {

			module: "caseTypes"

		}

	}
]
