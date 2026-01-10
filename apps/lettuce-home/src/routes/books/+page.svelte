<script lang="ts">
  import Book from '../../lib/components/Book.svelte';
  import { getCurrentBooks, getReadingLog } from '$lib/remote/reading-log.remote';
  import MediaCollection from '$lib/components/MediaCollection.svelte';
  let bookData = await getReadingLog();
  let currentBooks = await getCurrentBooks();
</script>

<svelte:head>
  <title>Books | Grant Montgomery</title>
</svelte:head>
<main class="space-y-8">
  <h1 class="text-3xl font-bold first-letter:capitalize">Books</h1>
  <MediaCollection title="Currently reading" count={currentBooks.length} type="book">
    {#each currentBooks as book (book.isbn)}
      <Book {...book} />
    {/each}
  </MediaCollection>
  {#each bookData as { title, items } (title)}
    <MediaCollection {title} count={items.length} type="book">
      {#each items as book (book.isbn)}
        <Book {...book} />
      {/each}
    </MediaCollection>
  {/each}
  <p class="mx-auto text-center text-sm">
    Images and data sourced from&nbsp;<a
      class="text-swamp-green-500 hover:underline"
      href="https://openlibrary.org">https://openlibrary.org</a
    >
  </p>
</main>
