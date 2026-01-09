<script lang="ts">
  import Book from '../../lib/components/Book.svelte';
  import { getCurrentBooks, getReadingLog } from '$lib/remote/reading-log.remote';
  const bookData = await getReadingLog();
  const currentBooks = await getCurrentBooks();
</script>

<svelte:head>
  <title>Books | Grant Montgomery</title>
</svelte:head>
<main class="space-y-6">
  <h1 class="text-3xl font-bold first-letter:capitalize">Books</h1>
  <div class="flex flex-col gap-8">
    <div class="grid gap-3">
      <span>
        <h2 class="mr-3 inline-block text-2xl font-bold">Currently reading</h2>
        <span>{currentBooks!.length} {currentBooks!.length > 1 ? 'books' : 'book'}</span>
      </span>
      <div class="grid grid-cols-[repeat(auto-fill,_minmax(10rem,_1fr))] gap-4 sm:gap-6">
        {#each currentBooks as book (book.isbn)}
          <Book {...book} />
        {/each}
      </div>
    </div>
    {#each bookData as { year, books } (year)}
      <div class="grid gap-3">
        <span>
          <h2 class="mr-3 inline-block text-2xl font-bold">{year}</h2>
          <span>{books!.length} {books!.length > 1 ? 'books' : 'book'}</span>
        </span>
        <div class="grid grid-cols-[repeat(auto-fill,_minmax(10rem,_1fr))] gap-4 sm:gap-6">
          {#each books as book (book.isbn)}
            <Book {...book} />
          {/each}
        </div>
      </div>
    {/each}
  </div>
  <p class="mx-auto text-center text-sm">
    Images and data sourced from&nbsp;<a
      class="text-swamp-green-500 hover:underline"
      href="https://openlibrary.org">https://openlibrary.org</a
    >
  </p>
</main>
