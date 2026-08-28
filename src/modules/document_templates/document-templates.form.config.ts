// src/modules/document-templates/document-templates.form.config.ts
import type { Field } from '@/lib/createCrudForm';

export const documentTemplatesFields: Field[] = [
  {
    name: 'name',
    label: 'document-templates.fields.name',
    type: 'text',
    tab: 'general',
    required: true
  },
  {
    name: 'description',
    label: 'document-templates.fields.description',
    type: 'textarea',
    tab: 'general'
  },
  {
    name: 'template',
    label: 'document-templates.fields.template',
    type: 'file',
    tab: 'general',
    required: true
  }
];

export const documentTemplatesEditFields: Field[] = [
    {
        name: 'name',
        label: 'document-templates.fields.name',
        type: 'text',
        tab: 'general',
        required: true
    },
    {
        name: 'description',
        label: 'document-templates.fields.description',
        type: 'textarea',
        tab: 'general'
    }
];
