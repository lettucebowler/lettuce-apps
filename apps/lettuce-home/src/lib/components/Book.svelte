<script lang="ts">
  import type { ReadingLogEntry } from '$lib/schemas';
  import MediaCard from './MediaCard.svelte';

  let { title, subtitle, authors, isbn }: ReadingLogEntry = $props();
</script>

<a href="https://openlibrary.org/isbn/{isbn}">
  <MediaCard>
    {#snippet media()}
      <img
        loading="lazy"
        alt={`${title}${subtitle ? ': ' + subtitle : ''}`}
        src="/covers/book-{isbn}.webp"
        class="rounded"
      />{/snippet}
    {#snippet info()}
      <h3 class="font-bold">{title}</h3>
      {#if subtitle}
        <p class="text-sm">{subtitle}</p>
      {/if}
      {#each authors as author}
        <p>{author}</p>
      {/each}
    {/snippet}
  </MediaCard>
</a>
