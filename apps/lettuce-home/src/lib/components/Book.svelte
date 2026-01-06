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
      <h3 class="text-md font-bold">{title}</h3>
      {#if subtitle}
        <p class="text-sm">{subtitle}</p>
      {/if}
      <!-- {#each authors as author}
        <p class="text-sm">{author}</p>
      {/each} -->
      <p class="text-sm">By {authors.join(', ')} ({published})</p>
    {/snippet}
  </MediaCard>
</a>
