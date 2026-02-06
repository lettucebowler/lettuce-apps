<script lang="ts">
  import type { Post } from 'content-collections';

  let {
    slug,
    title,
    summary,
    tags,
    date,
    heading = 'h3'
  }: Post & { heading?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' } = $props();
</script>

<div>
  <svelte:element this={heading} class="mb-2 text-xl font-bold text-swamp-green-500 hover:underline"
    ><a href="/posts/{slug}">{title}</a></svelte:element
  >
  {#if summary}
    <p class="mb-1">{summary}</p>
  {/if}
  <p class="">
    {new Date(date).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })}
    {#each tags as tag}
      &nbsp;
      <a href="/posts?tag={tag}" class="text-sm text-frost-100 hover:underline">#{tag}</a>
    {/each}
  </p>
</div>
