import type { Field } from '@/lib/createCrudForm';

export const customerFields: Field[] = [
  { name: 'name', label: 'customers.fields.name', type: 'text', required: true },
  { name: 'email', label: 'customers.fields.email', type: 'email', required: true },
  { name: 'address', label: 'customers.fields.address', type: 'text' },
  { name: 'phone', label: 'customers.fields.phone', type: 'tel' },
  { name: 'notes', label: 'customers.fields.notes', type: 'textarea' },
  { name: 'with_account', label: 'customers.fields.with_account', type: 'checkbox' },
]
