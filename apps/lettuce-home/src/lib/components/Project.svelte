<script lang="ts">
  import type { Project } from 'content-collections';
  import ExternalLinkIcon from './ExternalLinkIcon.svelte';

  let {
    title,
    summary,
    status,
    description,
    url,
    heading = 'h3'
  }: Project & { heading?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' } = $props();
</script>

<article>
  {#if url}
    <a href={url} class="group inline text-swamp-green-500">
      {@render Title({ title, heading })}
      <ExternalLinkIcon class="mb-3 inline-block size-3" />
    </a>
  {:else}
    <div class="text-antique-brass-500">
      {@render Title({ title, heading })}
    </div>
  {/if}
  <div class="space-y-1">
    <p>{summary}</p>
    <dl class="flex">
      <dt>status:</dt>
      &nbsp;
      <dd class="font-medium">{status}</dd>
    </dl>
    {#each description as paragraph (paragraph)}
      <p>{paragraph}</p>
    {/each}
  </div>
</article>

{#snippet Title({ title, heading }: { title: string; heading: string })}
  <svelte:element
    this={heading}
    class="mb-2 inline-block text-xl font-bold capitalize group-hover:underline"
    >{title}</svelte:element
  >
{/snippet}
