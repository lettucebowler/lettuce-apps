<script lang="ts">
  import { type MovieLogEntry } from '$lib/schemas';
  import MediaCard from './MediaCard.svelte';

  let { tmdb, title, directors, released, rewatch, rating, comment, watched }: MovieLogEntry =
    $props();

  function createAnchorName(tmdb: number, watched: string) {
    return `movie-${tmdb}-${watched}`;
  }
</script>

<MediaCard>
  {#snippet media()}
    <a href="https://www.themoviedb.org/movie/{tmdb}" class="block">
      <div class="relative aspect-2/3 w-full overflow-hidden">
        <img loading="lazy" class="rounded" alt={title} src="/posters/movie-{tmdb}.webp" />
      </div>
    </a>
  {/snippet}
  {#snippet info()}
    <h3>
      <span class="text-md font-medium">{title} </span>
      <span class="text-snow-100">({released})</span>
    </h3>
    <ul class="mb-1">
      {#each directors as director}
        <li class="text-sm">{director}</li>
      {/each}
    </ul>
    {#if rating}
      {@render stars(rating)}
    {/if}
    {#if rewatch}
      <p class="text-sm font-bold text-antique-brass-500 italic">rewatch</p>
    {/if}
  {/snippet}
</MediaCard>

{#snippet stars(rating: number)}
  <div class="flex gap-0.5 text-putty-500">
    {#each { length: rating }, i (i)}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="size-3"
      >
        <path
          fill-rule="evenodd"
          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
          clip-rule="evenodd"
        />
      </svg>
    {/each}
  </div>
{/snippet}
