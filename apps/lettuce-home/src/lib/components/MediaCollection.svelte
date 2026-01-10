<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    title: string;
    count: number;
    type: 'book' | 'movie';
    children?: Snippet;
  };

  let { title, count, children, type }: Props = $props();
</script>

<div class="space-y-4">
  <div>
    <h2 class="inline-block text-2xl font-bold">{title}</h2>
    &nbsp;
    <span>{count} {count > 1 ? type + 's' : type}</span>
  </div>
  <div
    class="grid grid-cols-[repeat(auto-fill,_minmax(10rem,_1fr))] gap-x-2 gap-y-4 sm:gap-x-4 sm:gap-y-6"
  >
    {@render children?.()}
  </div>
</div>
