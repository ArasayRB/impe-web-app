import { t } from '@/lib/i18n/i18n';

function formatPeriod(
  period: string | number,
  groupBy: string
) {

  const value =
    String(period);

  if (groupBy === 'week') {

    const year =
      value.substring(0, 4);

    const week =
      value.substring(4);

    return `${t('common.analytics.week')} ${week}`;
  }

  return value;
}

export function mapTimeline(
  items: any[],
  valueKey: string,
  groupBy: string
) {

  return {

    labels:
      items.map(
        item =>
          formatPeriod(
            item.period,
            groupBy
          )
      ),

    values:
      items.map(
        item =>
          Number(
            item[valueKey] || 0
          )
      )
  };
}
