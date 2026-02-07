<script lang="ts">
  import type { Snippet } from 'svelte';

  type MediaCardProps = {
    media: Snippet;
    info: Snippet;
  };
  let { media, info }: MediaCardProps = $props();
</script>

<div class="@container">
  <figure class="space-y-2 @min-[19rem]:flex @min-[19rem]:gap-2">
    <div class="max-w-44 min-w-30 flex-initial shadow-sm">
      {@render media()}
    </div>
    <figcaption class="min-w-40 flex-3">
      {@render info()}
    </figcaption>
  </figure>
</div>
