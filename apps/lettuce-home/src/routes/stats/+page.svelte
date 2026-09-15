<script lang="ts">
  import { getReadingLogsDesc } from '#lib/collections.js';
  import YearlyBarChart from '#lib/components/YearlyBarChart.svelte';

  const years = getReadingLogsDesc().map((log) => log.year);
</script>

<svelte:head>
  <title>Stats | Grant Montgomery</title>
  <meta name="description" content="Pretty graphs of my media consumption history" />
</svelte:head>
<main>
  <h1 class="mb-12 text-3xl font-bold text-snow-300">Yearly stats</h1>
  <div class="space-y-8">
    {#each years as year (year)}
      <YearlyBarChart {year} />
    {/each}
  </div>
</main>
