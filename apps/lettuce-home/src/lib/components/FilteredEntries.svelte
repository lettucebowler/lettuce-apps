<script lang="ts">
  import { getFilteredBooks, getFilteredMovies } from '$lib/collections';
  import type { MovieLogEntry, ReadingLogEntry } from '$lib/schemas';

  type Entry = ReadingLogEntry | MovieLogEntry;
  type EntryType = Entry['type'];
  type Props = {
    years: number[];
    months: string[];
    type: EntryType;
  };

  const { years, months, type }: Props = $props();

  const items = $derived(
    type === 'book'
      ? getFilteredBooks({
          years,
          months
        })
      : getFilteredMovies({ years, months })
  );

  function getEntryMediaPath(entry: Entry) {
    switch (entry.type) {
      case 'book':
        return `/covers/book-${entry.isbn}.webp`;
      case 'movie':
        return `/posters/movie-${entry.tmdb}.webp`;
    }
  }

  function getEntryId(entry: Entry) {
    switch (entry.type) {
      case 'book':
        return entry.isbn;
      case 'movie':
        return entry.tmdb;
    }
  }
</script>

<div class="@container">
  <div class="grid grid-cols-[repeat(auto-fill,_minmax(6rem,_1fr))] gap-4">
    {#each items as item (getEntryId(item))}
      <img src={getEntryMediaPath(item)} class="m-0! aspect-2/3 w-full" alt={item.title} />
    {/each}
  </div>
</div>
