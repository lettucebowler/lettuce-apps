<script lang="ts">
  import type { ReadingLogEntry } from '$lib/schemas';
  import MediaCard from './MediaCard.svelte';

  let {
    title,
    subtitle,
    authors,
    isbn,
    loading = 'lazy'
  }: ReadingLogEntry & { loading?: 'lazy' | 'eager' } = $props();
</script>

<a href="https://openlibrary.org/isbn/{isbn}">
  <MediaCard>
    {#snippet media()}
      <img
        {loading}
        alt={`${title}${subtitle ? ': ' + subtitle : ''}`}
        src="/covers/book-{isbn}.webp"
        class="rounded"
      />{/snippet}
    {#snippet info()}
      <h3 class="text-md font-bold">{title}</h3>
      {#if subtitle}
        <p class="text-sm">{subtitle}</p>
      {/if}
      {#each authors as author}
        <p class="text-sm">{author}</p>
      {/each}
    {/snippet}
  </MediaCard>
</a>
