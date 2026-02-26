<script lang="ts">
  import type { ReadingLogEntry } from '$lib/schemas';
  import LogEntry from './LogEntry.svelte';

  let {
    title,
    subtitle,
    authors,
    isbn,
    published,
    reread,
    comment,
    completed,
    rating
  }: ReadingLogEntry = $props();
</script>

<LogEntry
  type="book"
  {title}
  year={published}
  contributors={authors}
  id={isbn}
  revisited={reread}
  {subtitle}
  {comment}
  {rating}
  {completed}
/>
