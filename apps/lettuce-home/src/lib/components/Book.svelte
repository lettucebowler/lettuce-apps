<script lang="ts">
  import type { ReadingLogEntry } from '$lib/schemas';
  import MediaCard from './MediaCard.svelte';

  let { title, subtitle, authors, isbn, published }: ReadingLogEntry = $props();
</script>

<MediaCard>
  {#snippet media()}
    <a href="https://openlibrary.org/isbn/{isbn}">
      <img
        loading="lazy"
        alt={`${title}${subtitle ? ': ' + subtitle : ''}`}
        src="/covers/book-{isbn}.webp"
        class="rounded"
      />
    </a>
  {/snippet}
  {#snippet info()}
    <h3 class="">
      <span class="font-bold">{title}</span> <span class="text-snow-100">({published})</span>
    </h3>
    {#if subtitle}
      <p class="text-sm">{subtitle}</p>
    {/if}
    <ul class="mb-1">
      {#each authors as author}
        <li class="text-sm">{author}</li>
      {/each}
    </ul>
  {/snippet}
</MediaCard>
