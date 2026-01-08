<script lang="ts">
  import type { Snippet } from 'svelte';

  type MediaCardProps = {
    media: Snippet;
    info: Snippet;
  };
  let { media, info }: MediaCardProps = $props();
</script>

<div class="@container min-w-40">
  <figure class="flex flex-wrap gap-x-4 gap-y-2">
    <div class="mx-auto aspect-2/3 w-full min-w-20 flex-2 basis-20 shadow-sm">
      {@render media()}
    </div>
    <figcaption class="min-w-40 flex-3 basis-40">
      {@render info()}
    </figcaption>
  </figure>
</div>
