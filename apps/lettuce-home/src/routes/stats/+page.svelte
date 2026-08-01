<script lang="ts">
  import { getReadingLogsDesc } from '#lib/collections';
  import YearlyBarChart from '#lib/components/YearlyBarChart.svelte';

  const years = getReadingLogsDesc().map((log) => log.year);
</script>

<main>
  <h1 class="mb-12 text-3xl font-bold text-snow-300">Yearly stats</h1>
  <div class="space-y-8">
    {#each years as year (year)}
      <YearlyBarChart {year} />
    {/each}
  </div>
</main>
