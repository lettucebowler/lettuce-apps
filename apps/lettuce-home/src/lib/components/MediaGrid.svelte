<script lang="ts">
  import type { Snippet } from 'svelte';
  let { children }: { children: Snippet } = $props();
</script>

<div class="@container">
  <div class="grid grid-cols-[repeat(auto-fill,_minmax(6rem,_1fr))] gap-2">
    {@render children?.()}
  </div>
</div>
