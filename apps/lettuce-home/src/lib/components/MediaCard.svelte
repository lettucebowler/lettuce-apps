<script lang="ts">
  import type { Snippet } from 'svelte';

  type MediaCardProps = {
    media: Snippet;
    info: Snippet;
  };
  let { media, info }: MediaCardProps = $props();
</script>

<div class="@container flex flex-col">
  <figure class="flex flex-auto flex-wrap gap-2 sm:gap-x-4 @min-[19rem]:flex-row">
    <div class="aspect-2/3 max-w-44 min-w-30 flex-2 shadow-sm">
      {@render media()}
    </div>
    <figcaption class="min-w-40 flex-3">
      {@render info()}
    </figcaption>
  </figure>
</div>
