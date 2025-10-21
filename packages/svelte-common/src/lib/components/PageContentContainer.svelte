<script lang="ts">
  import type { SvelteHTMLElements } from 'svelte/elements';
  let { children }: SvelteHTMLElements['div'] = $props();
</script>

<div class="bg-charade-900 ml-[calc(100vw-100%)]">
  <div class="mx-auto min-h-[100dvh] w-full max-w-(--breakpoint-md)">
    {@render children?.()}
  </div>
</div>
