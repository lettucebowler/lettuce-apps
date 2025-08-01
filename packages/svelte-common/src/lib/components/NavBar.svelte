<script lang="ts">
  import type { SvelteHTMLElements } from 'svelte/elements';

  let { children }: SvelteHTMLElements['nav'] = $props();
</script>

<nav class="flex w-full gap-4">
  {@render children?.()}
</nav>
