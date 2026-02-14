<script lang="ts">
  import { filterBooks, filterMovies } from '$lib/collections';
  import type { MovieLogEntry, ReadingLogEntry } from '$lib/schemas';

  type Entry = ReadingLogEntry | MovieLogEntry;
  type EntryType = Entry['type'];
  type Props = {
    start: string;
    end: string;
    type: EntryType;
  };

  const { start, end, type }: Props = $props();

  const items = $derived(
    type === 'book'
      ? filterBooks((book) => {
          if (!book.completed) {
            return false;
          }
          return book.completed >= start && book.completed <= end;
        })
      : filterMovies((movie) => {
          if (!movie.watched) {
            return false;
          }
          return movie.watched >= start && movie.watched <= end;
        })
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
        return `${entry.isbn}:${entry.completed}`;
      case 'movie':
        return `${entry.tmdb}:${entry.watched}`;
    }
  }
</script>

<div class="@container">
  <div class="grid grid-cols-[repeat(auto-fill,_minmax(6rem,_1fr))] gap-4">
    {#each items as item (getEntryId(item))}
      <a
        title={item.title}
        href={item.type === 'book'
          ? `https://openlibrary.org/isbn/${item.isbn}`
          : `https://www.themoviedb.org/movie/${item.tmdb}`}
        ><img src={getEntryMediaPath(item)} class="m-0! aspect-2/3 w-full" alt={item.title} /></a
      >
    {:else}
      <p class="col-span-full">No entries within specified date range</p>
    {/each}
  </div>
</div>
