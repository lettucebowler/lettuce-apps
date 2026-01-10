<script lang="ts">
  import type { Snippet } from 'svelte';

  type MediaCardProps = {
    media: Snippet;
    info: Snippet;
  };
  let { media, info }: MediaCardProps = $props();
</script>

<div class="@container">
  <figure class="grid gap-2 @min-[240px]:grid-cols-[2fr_3fr] @min-[600px]:grid-cols-[240px_1fr]">
    <div class="mx-auto aspect-2/3 flex-2 basis-2 shadow-sm">
      {@render media()}
    </div>
    <figcaption class="flex-3 flex-auto">
      {@render info()}
    </figcaption>
  </figure>
</div>
