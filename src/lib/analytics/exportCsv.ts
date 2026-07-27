import { t } from '@/lib/i18n/i18n';

export function exportCsv(
  filename: string,
  columns: any[],
  rows: any[]
) {

  const headers =
    columns.map(
      c => t(c.label)
    );

  const data =
    rows.map(
      row =>
        columns.map(
          c =>
            row[c.key] ?? ''
        )
    );

  const csv =
    [
      headers,
      ...data
    ]
    .map(
      line =>
        line.join(',')
    )
    .join('\n');

  const blob =
    new Blob(
      [csv],
      {
        type: 'text/csv'
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement('a');

  link.href = url;

  link.download =
    `${filename}.csv`;

  link.click();

  URL.revokeObjectURL(url);
}
