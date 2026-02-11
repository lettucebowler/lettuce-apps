<script lang="ts">
  import type { Snippet } from 'svelte';

  type MediaCardProps = {
    media: Snippet;
    info: Snippet;
  };
  let { media, info }: MediaCardProps = $props();
</script>

<div class="@container">
  <figure
    class="@max-[18rem]:space-y-2 @min-[18rem]:flex @min-[18rem]:gap-x-2 @min-[20rem]:gap-x-4"
  >
    <div class="max-w-30 min-w-30 flex-2 shadow-sm @max-[18rem]:max-w-44">
      {@render media()}
    </div>
    <figcaption class="min-w-40 flex-3">
      {@render info()}
    </figcaption>
  </figure>
</div>
