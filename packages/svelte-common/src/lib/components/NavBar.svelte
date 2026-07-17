<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet<[]> } = $props();
</script>

<nav
  class="bg-charade-950 text-charade-50 flex flex-wrap items-stretch justify-center gap-x-4 gap-y-1 rounded-lg px-4 pt-3 pb-2 font-bold sm:justify-start sm:text-xl lg:text-2xl"
>
  {@render children?.()}
</nav>
