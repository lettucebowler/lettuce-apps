<script lang="ts">
  import type { ReadingLogEntry } from '#lib/schemas';
  import BookCover from './BookCover.svelte';
  import MediaFigure from './MediaFigure.svelte';

  let { title, subtitle, authors, published, comment, rating, isbn, reread }: Omit<ReadingLogEntry, 'logDate'> =
    $props();
</script>

<MediaFigure
  {title}
  {subtitle}
  contributors={authors}
  year={published}
  {comment}
  {rating}
  href={`https://openlibrary.org/isbn/${isbn}`}
>
  {#snippet media()}
    <BookCover {isbn} {title} />
  {/snippet}
</MediaFigure>
