export function renderStatusPill(status: string, t: any) {
  const map: Record<string, string> = {
    open: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  const cls = map[status] || 'bg-gray-100 text-gray-800';

  return `
    <span class="px-2 py-1 text-xs font-medium rounded ${cls}">
      ${t(`cases.status.${status}`)}
    </span>
  `;
}
