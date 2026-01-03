<script lang="ts">
  import { type MovieLogEntry } from '$lib/schemas';
  import MediaCard from './MediaCard.svelte';

  let { imdb, title, directors, released }: MovieLogEntry = $props();
</script>

<a href="https://imdb.com/title/{imdb}">
  <MediaCard>
    {#snippet media()}
      <img loading="lazy" class="rounded" alt={title} src="/posters/movie-{imdb}.webp" />{/snippet}
    {#snippet info()}
      <h3><span class="font-medium">{title}</span> ({released})</h3>
      {#each directors as director}
        <p>{director}</p>
      {/each}
    {/snippet}
  </MediaCard>
</a>
