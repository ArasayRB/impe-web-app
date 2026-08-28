// src/modules/document_templates/document-templates.columns.config.ts
import { t } from '@/lib/i18n/i18n';
import { createCrudSwitch } from '@/lib/crud/components/createCrudSwitch';
import {
	activateDocumentTemplate,
	deactivateDocumentTemplate
} from './document-templates.store';

export const documentTemplateColumns = [
	{
		key: 'name',
		label: 'document-templates.columns.name',
	},
	{
		key: 'description',
		label: 'document-templates.columns.description',
	},
	{
		key: 'active',
		label: 'document-templates.columns.status',

		component: createCrudSwitch({

			async onChange(value, row:any) {

				if (value) {

					await activateDocumentTemplate(row.id);

				} else {

					await deactivateDocumentTemplate(row.id);

				}

			}

		})
	},
	{
		key: 'created_at',
		label: 'document-templates.columns.created_at',
		render: (value: string) => {
			if (!value) return '';

			return value
				.replace('T', ' ')
				.slice(0, 16);
		}
	},
];
