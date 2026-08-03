<script lang="ts">
  import { getBarChartData } from '#lib/chart-data';
  import { BarChart } from 'layerchart';

  type Props = {
    year: number;
  };

  let { year }: Props = $props();

  const data = $derived(getBarChartData(year).map((item) => ({ ...item, value: item.books })));
</script>

<div class="space-y-8 rounded-lg bg-charade-950 p-4">
  <h2 class="text-center text-xl font-bold">Books and Movies By Month in {year}</h2>
  <div id="chart-{year}" class="h-75">
    <BarChart
      {data}
      x="month"
      series={[
        {
          key: 'books',
          color: 'var(--color-swamp-green-500)',
          label: 'Books',
        },
        {
          key: 'movies',
          color: 'var(--color-frost-400)',
          label: 'Movies',
        },
      ]}
      seriesLayout="group"
      props={{
        xAxis: {
          format: (v: string) => v.slice(0, 3) + '.',
          tickLabelProps: {
            dy: 8,
          },
        },
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
          insets: {
            x: 2,
          },
          // motion: {
          //   type: 'tween',
          //   duration: 200,
          // },
        },
      }}
      legend
      height={300}
    ></BarChart>
  </div>
</div>

<style>
  :global(:where(.lc-axis-label, .lc-axis-tick-label)) {
    font-size: 13px;
    stroke: var(--color-charade-50);
    stroke-width: 0.75px;
    font-weight: 400;
  }
</style>
