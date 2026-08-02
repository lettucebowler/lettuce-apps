<script lang="ts">
  import { getBarChartData } from '#lib/chart-data';
  import { BarChart } from 'layerchart';

  type Props = {
    year: number;
  };

  let { year }: Props = $props();

  const data = $derived(getBarChartData(year));
</script>

<div class="space-y-8 rounded-lg bg-charade-950 p-4">
  <h2 class="text-center text-xl font-bold">Books and Movies By Month in {year}</h2>
  <div id="chart-{year}" class="h-75">
    <BarChart
      {data}
      x="month"
      series={[
        { key: 'books', color: 'var(--color-swamp-green-500)' },
        {
          key: 'movies',
          color: 'var(--color-frost-400)',
        },
      ]}
      seriesLayout="group"
      props={{
        xAxis: { format: 'none', class: 'stroke-1!' },
        yAxis: { format: 'metric' },
        tooltip: {
          header: { format: 'none' },
          root: {
            class: 'bg-charade-900 text-charade-50',
          },
          item: {
            class: 'text-charade-50',
          },
          hideTotal: true,
        },
        bars: {
          strokeWidth: 0,
        },
      }}
      legend
      height={300}
    />
  </div>
</div>

<style>
  :global(:where(.lc-axis-label, .lc-axis-tick-label)) {
    font-size: 12px;
    stroke: var(--color-surface-100, light-dark(white, black));
    stroke-width: 0.75px;
    font-weight: 300;
  }
</style>
