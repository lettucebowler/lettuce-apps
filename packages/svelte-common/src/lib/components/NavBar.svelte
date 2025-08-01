<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet<[]> } = $props();
</script>

<nav class="flex gap-2 sm:gap-4">
  {@render children?.()}
</nav>
