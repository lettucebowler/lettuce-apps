<script lang="ts">
  import type { SvelteHTMLElements } from 'svelte/elements';
  let { children }: SvelteHTMLElements['div'] = $props();
</script>

<div class="ml-[calc(100vw-100%)]">
  <div class="max-w-(--breakpoint-md) mx-auto min-h-[100dvh] w-full">
    {@render children?.()}
  </div>
</div>
