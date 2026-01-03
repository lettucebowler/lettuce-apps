<script lang="ts">
  import Book from '../../lib/components/Book.svelte';
  import { getReadingLog } from '$lib/remote/reading-log.remote';
  const bookData = await getReadingLog();
</script>

<main class="mx-auto flex flex-col gap-6">
  <h1 class="text-3xl font-bold first-letter:capitalize">bookshelf</h1>
  <div class="flex flex-col gap-8">
    {#each Object.keys(bookData).sort().reverse() as year (year)}
      {@const yearBooks = bookData[year]}
      <div class="grid gap-3">
        <span>
          <h2 class="mr-3 inline-block text-2xl font-bold">{year}</h2>
          <span>{yearBooks!.length} {yearBooks!.length > 1 ? 'books' : 'book'}</span>
        </span>
        <div class="grid grid-cols-[repeat(auto-fill,_minmax(10rem,_1fr))] gap-6">
          {#each yearBooks as book (book.isbn)}
            <Book {...book} />
          {/each}
        </div>
      </div>
    {/each}
  </div>
</main>
