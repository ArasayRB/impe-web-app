import ApexCharts from 'apexcharts';

const charts =
  new Map<
    string,
    ApexCharts
  >();

export function destroyChart(
  id: string
) {

  const chart =
    charts.get(id);

  if (!chart) {
    return;
  }

  chart.destroy();

  charts.delete(id);
}

export function registerChart(
  id: string,
  chart: ApexCharts
) {

  destroyChart(id);

  charts.set(
    id,
    chart
  );
}

export function destroyAllCharts() {

    charts.forEach(chart => {
        chart.destroy();
    });

    charts.clear();

}
