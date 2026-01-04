<script lang="ts">
  import { type MovieLogEntry } from '$lib/schemas';
  import MediaCard from './MediaCard.svelte';

  let {
    tmdb,
    title,
    directors,
    released,
    loading = 'lazy'
  }: MovieLogEntry & { loading?: 'lazy' | 'eager' } = $props();
</script>

<a href="https://www.themoviedb.org/movie/{tmdb}">
  <MediaCard>
    {#snippet media()}
      <div class="relative aspect-2/3 w-full">
        <img {loading} class="rounded" alt={title} src="/posters/movie-{tmdb}.webp" />
      </div>
    {/snippet}
    {#snippet info()}
      <h3>
        <span class="text-md font-medium">{title}</span>
        <span class="text-snow-100">({released})</span>
      </h3>
      <!-- {#each directors as director} -->
      <p class="text-sm">{directors.join(', ')}</p>
      <!-- {/each} -->
    {/snippet}
  </MediaCard>
</a>
