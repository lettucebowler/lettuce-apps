<script lang="ts">
  import type { Snippet } from 'svelte';

  type MediaCardProps = {
    media: Snippet;
    info: Snippet;
  };
  let { media, info }: MediaCardProps = $props();
</script>

<div class="@container">
  <!-- <figure class="grid gap-2 @min-[240px]:grid-cols-[2fr_3fr] @min-[540px]:grid-cols-[160px_1fr]"> -->
  <figure class="grid grid-cols-1 gap-4 @min-[18rem]:grid-cols-[minmax(120px,2fr)_3fr]">
    <div class="aspect-2/3 max-w-44 shadow-sm">
      {@render media()}
    </div>
    <figcaption class="flex-3 flex-auto">
      {@render info()}
    </figcaption>
  </figure>
</div>
