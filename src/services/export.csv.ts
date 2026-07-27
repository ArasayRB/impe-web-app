import { showSuccess, showError } from '@/lib/toast';
import { t } from '@/lib/i18n/i18n';
import { i18nVersion } from '@/lib/i18n/store';

type ExportColumn<T> = {
  key: string;
  label: string;
  format?: (value: any, row: T) => string;
};

function getValue(obj: any, path: string) {
  return path.split('.').reduce(
    (acc, key) => acc?.[key],
    obj
  );
}

export function exportCsv<T>(
  filename: string,
  rows: T[],
  columns: ExportColumn<T>[]
) {

  const headers = columns.map(c => t(c.label));

  const csvRows = rows.map(row => {
    return columns.map(col => {

      const raw = getValue(row, col.key);

      const value = col.format
        ? col.format(raw, row)
        : raw;

      return `"${String(value ?? '')
        .replace(/"/g, '""')}"`;
    });
  });

  const csv = [
    headers.join(','),
    ...csvRows.map(r => r.join(','))
  ].join('\n');

  const blob = new Blob(
    [csv],
    { type: 'text/csv;charset=utf-8;' }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = url;
  link.download = `${filename}.csv`;

  link.click();

  URL.revokeObjectURL(url);
  showSuccess(
    t('common.messages.exported')
  );
}