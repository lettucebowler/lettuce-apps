<script lang="ts">
  import type { ReadingLogEntry } from '#lib/schemas.js';
  import BookCover from './BookCover.svelte';
  import BookLink from './BookLink.svelte';
  import MediaFigure from './MediaFigure.svelte';

  let { title, subtitle, authors, published, comment, rating, isbn }: Omit<ReadingLogEntry, 'logDate'> = $props();
</script>

<MediaFigure {title} {subtitle} contributors={authors} year={published} {comment} {rating}>
  {#snippet media()}
    <BookLink {isbn}>
      <BookCover {isbn} {title} />
    </BookLink>
  {/snippet}
</MediaFigure>
