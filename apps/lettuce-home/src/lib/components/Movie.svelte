<script lang="ts">
  import { type MovieLogEntry } from '$lib/schemas';
  import MediaFigure from './MediaFigure.svelte';

  let { title, directors, released, rewatch, rating, comment, imageSrc, url }: MovieLogEntry = $props();
</script>

{#snippet feature()}
  <p class="font-bold text-antique-brass-500 italic">rewatch</p>
{/snippet}

<MediaFigure
  {title}
  contributors={directors}
  year={released}
  {comment}
  {rating}
  {imageSrc}
  href={url}
  feature={rewatch ? feature : undefined}
/>
