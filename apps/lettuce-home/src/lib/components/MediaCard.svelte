<script lang="ts">
  import type { Snippet } from 'svelte';

  type MediaCardProps = {
    media: Snippet;
    info: Snippet;
  };
  let { media, info }: MediaCardProps = $props();
</script>

<div class="@container flex flex-col">
  <figure
    class="flex flex-auto flex-col gap-2 @min-[18rem]:grid @min-[18rem]:grid-cols-[minmax(120px,2fr)_3fr] @min-[18rem]:gap-4"
  >
    <div class="aspect-2/3 max-w-44 shadow-sm">
      {@render media()}
    </div>
    <figcaption class="flex-auto">
      {@render info()}
    </figcaption>
  </figure>
</div>
