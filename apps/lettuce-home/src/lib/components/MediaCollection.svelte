<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    title?: string;
    count?: number;
    type: 'book' | 'movie';
    children?: Snippet;
  };

  let { title, count, children, type }: Props = $props();
</script>

<div class="space-y-4">
  {#if title}
    <header>
      <h2 class="inline-block text-2xl font-bold">{title}</h2>
      {#if count}
        &nbsp;
        <span>{count} {count > 1 ? type + 's' : type}</span>
      {/if}
    </header>
  {/if}
  <div class="grid grid-cols-[repeat(auto-fill,_minmax(10rem,_1fr))] gap-4">
    {@render children?.()}
  </div>
</div>
