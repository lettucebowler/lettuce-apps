<script lang="ts">
  import { type MovieLogEntry } from '$lib/schemas';
  import MediaCard from './MediaCard.svelte';

  let { tmdb, title, directors, released }: MovieLogEntry = $props();
</script>

<a href="https://www.themoviedb.org/movie/{tmdb}">
  <MediaCard>
    {#snippet media()}
      <div class="relative aspect-2/3 w-full">
        <img loading="lazy" class="rounded" alt={title} src="/posters/movie-{tmdb}.webp" />
      </div>
    {/snippet}
    {#snippet info()}
      <h3>
        <span class="text-md font-medium">{title}</span>
        <span class="text-snow-100">({released})</span>
      </h3>
      <!-- {#each directors as director} -->
      <!-- {/each} -->
      <ul>
        {#each directors as director}
          <li class="text-sm">{director}</li>
        {/each}
      </ul>
    {/snippet}
  </MediaCard>
</a>
