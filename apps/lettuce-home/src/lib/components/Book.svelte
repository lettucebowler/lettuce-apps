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
        class="aspect-2/3 w-full rounded"
      />
    </a>
  {/snippet}
  {#snippet info()}
    <h3 class="">
      <span class="font-medium">{title}</span>
      <span class="font-light text-charade-100">{published}</span>
    </h3>
    {#if subtitle}
      <p class="font-light text-charade-100">{subtitle}</p>
    {/if}
    <ul class="">
      {#each authors as author}
        <li class="font-light text-charade-100">{author}</li>
      {/each}
    </ul>
  {/snippet}
</MediaCard>
