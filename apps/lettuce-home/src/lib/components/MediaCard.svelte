<script lang="ts">
  import type { Snippet } from 'svelte';

  type MediaCardProps = {
    media: Snippet;
    info: Snippet;
  };
  let { media, info }: MediaCardProps = $props();
</script>

<div class="@container min-w-40">
  <figure class="flex flex-wrap gap-4">
    <div class="mx-auto aspect-2/3 w-full max-w-60 min-w-20 flex-2 basis-20 shadow-sm">
      {@render media()}
    </div>
    <figcaption class="min-w-40 flex-3">
      {@render info()}
    </figcaption>
  </figure>
</div>
