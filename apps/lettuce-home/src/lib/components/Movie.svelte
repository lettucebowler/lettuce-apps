<script lang="ts">
  import { type MovieLogEntry } from '$lib/schemas';
  import MediaFigure from './MediaFigure.svelte';

  let { title, directors, released, rewatch, rating, comment, imageSrc, url, tmdb }: MovieLogEntry = $props();
</script>

{#snippet feature()}
  <span class="-m-0.5 icon-[heroicons--arrow-path-16-solid] size-5 text-antique-brass-500" title="rewatch"></span>
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
