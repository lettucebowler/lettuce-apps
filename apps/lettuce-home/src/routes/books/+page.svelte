<script lang="ts">
  import Book from '../../lib/components/Book.svelte';
  import MediaCollection from '$lib/components/MediaCollection.svelte';
  import { getCurrentlyReading, getReadingLogsDesc } from '$lib/collections';
  const bookData = getReadingLogsDesc();
  const currentBooks = getCurrentlyReading();
</script>

<svelte:head>
  <title>Books | Grant Montgomery</title>
</svelte:head>
<main class="space-y-8">
  <h1 class="text-3xl font-bold first-letter:capitalize">Books</h1>
  <MediaCollection
    title="Currently reading"
    subtitle={`${currentBooks.length} book${currentBooks.length === 1 ? '' : 's'}`}
  >
    {#each currentBooks as book (book.isbn)}
      <Book {...book} />
    {/each}
  </MediaCollection>
  {#each bookData as { title, items } (title)}
    <MediaCollection {title} subtitle={`${items.length} book${items.length === 1 ? '' : 's'}`}>
      {#each items as book (book.isbn)}
        <Book {...book} />
      {/each}
    </MediaCollection>
  {/each}
  <p class="mx-auto text-center font-light">
    Images and data sourced from&nbsp;<a
      class="text-swamp-green-500 hover:underline"
      href="https://openlibrary.org">https://openlibrary.org</a
    >
  </p>
</main>
