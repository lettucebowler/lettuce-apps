<script lang="ts">
  import type { ReadingLogEntry } from '$lib/schemas';
  import MediaCard from './MediaCard.svelte';

  let { title, subtitle, authors, isbn, published }: ReadingLogEntry = $props();
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
      <h3 class="">
        <span class="font-bold">{title}</span> <span class="text-snow-100">({published})</span>
      </h3>
      {#if subtitle}
        <p class="text-sm">{subtitle}</p>
      {/if}
      <p class="text-sm">By {authors.join(', ')}</p>
    {/snippet}
  </MediaCard>
</a>
