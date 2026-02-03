<script lang="ts">
  import { getFilteredMovies } from '$lib/collections';
  type Props = {
    years: number[];
    months: string[];
  };

  const { years, months }: Props = $props();

  const items = $derived(
    getFilteredMovies({
      years,
      months
    })
  );
</script>

<div class="@container">
  <div class="grid grid-cols-[repeat(auto-fill,_minmax(6rem,_1fr))] gap-4">
    {#each items as item (item.tmdb)}
      <img src={`/posters/movie-${item.tmdb}.webp`} class="m-0!" alt={item.title} />
    {/each}
  </div>
</div>
