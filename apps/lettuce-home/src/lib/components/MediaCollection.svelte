<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    title?: Snippet;
    subtitle?: Snippet;
    children?: Snippet;
    heading?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    header?: Snippet;
  };

  let { children, header }: Props = $props();
</script>

<div class="@container space-y-4">
  {#if header}
    {@render header()}
  {/if}
  <div
    class="grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-[repeat(auto-fill,minmax(10.75rem,1fr))] lg:gap-x-4 lg:gap-y-6"
  >
    {@render children?.()}
  </div>
</div>
