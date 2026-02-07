<script lang="ts">
  import type { Post } from 'content-collections';

  type Props = {
    heading?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    headingClassname?: string;
  } & Post;

  let {
    slug,
    title,
    summary,
    tags,
    date,
    heading = 'h3',
    headingClassname = 'mb-2 text-xl text-swamp-green-500 underline font-medium'
  }: Props = $props();
</script>

<div>
  <svelte:element this={heading} class={headingClassname}
    ><a href="/posts/{slug}">{title}</a></svelte:element
  >
  {#if summary}
    <p class="">{summary}</p>
  {/if}
  <p class="flex max-w-120 flex-wrap items-end gap-x-2">
    <time
      >{new Date(date).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })}</time
    >
    {#each tags as tag}
      <a href="/posts?tag={tag}" class="inline-flex text-sm text-frost-100 hover:underline"
        >#{tag}</a
      >
    {/each}
  </p>
</div>
