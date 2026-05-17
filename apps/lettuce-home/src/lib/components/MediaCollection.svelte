<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    title?: Snippet;
    subtitle?: Snippet;
    children?: Snippet;
    heading?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  };

  let { title, children, heading = 'h2', subtitle }: Props = $props();
</script>

<div class="@container space-y-4">
  {#if title}
    <header>
      <svelte:element this={heading} class="inline-block text-2xl font-bold">{@render title()}</svelte:element>
      {#if subtitle}
        &nbsp;
        <span class="font-medium text-charade-100">{@render subtitle()}</span>
      {/if}
    </header>
  {/if}
  <div class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-[repeat(auto-fill,minmax(10.75rem,1fr))]">
    {@render children?.()}
  </div>
</div>
