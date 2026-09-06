<script lang="ts">
  import Book from '../../lib/components/Book.svelte';
  import MediaCollection from '#lib/components/MediaCollection.svelte';
  import { getCurrentlyReading, getReadingLogsDesc } from '#lib/collections.js';

  const current = getCurrentlyReading();
  const completed = getReadingLogsDesc();
</script>

<svelte:head>
  <title>Reading log | Grant Montgomery</title>
</svelte:head>
<main class="space-y-8">
  <h1 class="text-3xl font-bold first-letter:capitalize">Books</h1>
  {#if current.length}
    <MediaCollection>
      {#snippet header()}
        <header>
          <h2 class="inline-block scroll-mt-4 text-2xl font-bold" id="currently-reading">Currently reading</h2>
          <span class="ml-1 inline-block font-medium text-charade-100"
            >{current.length} book{current.length === 1 ? '' : 's'}</span
          >
        </header>
      {/snippet}
      {#each current as book (book.isbn)}
        <Book {...book} reread={false} />
      {/each}
    </MediaCollection>
  {/if}
  {#each completed as { year, books } (year)}
    <MediaCollection>
      {#snippet header()}
        <header>
          <h2 class="inline-block scroll-mt-4 text-2xl font-bold" id={year.toString()}>{year.toString()}</h2>
          <span class="ml-1 inline-block font-medium text-charade-100"
            >{books.length} book{books.length === 1 ? '' : 's'}</span
          >
        </header>
      {/snippet}
      {#each books as book (`${book.isbn}-${book.logDate}`)}
        <Book {...book} />
      {/each}
    </MediaCollection>
  {/each}
  <p class="mx-auto mt-32 text-center text-charade-100/90">
    Images and data sourced from&nbsp;<a class="text-swamp-green-500 hover:underline" href="https://openlibrary.org"
      >https://openlibrary.org</a
    >
  </p>
</main>
