<script lang="ts">
  import type { ReadingLogEntry } from '$lib/schemas';
  import LogEntry from './LogEntry.svelte';

  type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

  let {
    title,
    subtitle,
    authors,
    isbn,
    published,
    reread = false,
    comment,
    completed,
    rating,
  }: Optional<Omit<ReadingLogEntry, 'type'>, 'reread' | 'completed'> = $props();
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
