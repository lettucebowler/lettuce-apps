<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet<[]> } = $props();
</script>

<nav
  class="rounded-lg bg-charade-950 flex flex-wrap justify-center gap-x-4 gap-y-1 px-4 pb-2 pt-3 font-bold sm:justify-start sm:text-xl lg:text-2xl text-charade-50 items-stretch"
>
  {@render children?.()}
</nav>
