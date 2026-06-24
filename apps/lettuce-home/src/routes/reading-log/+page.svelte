<script lang="ts">
  import Book from '../../lib/components/Book.svelte';
  import MediaCollection from '$lib/components/MediaCollection.svelte';
  import { getCurrentlyReading, getReadingLogsDesc } from '$lib/collections';

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
      {#snippet title()}
        Currently reading
      {/snippet}
      {#snippet subtitle()}
        {@render bookCount(current.length)}
      {/snippet}
      {#each current as book (book.isbn)}
        <Book {...book} reread={false} />
      {/each}
    </MediaCollection>
  {/if}
  {#each completed as { year, books } (year)}
    <MediaCollection>
      {#snippet title()}
        {year}
      {/snippet}
      {#snippet subtitle()}
        {@render bookCount(books.length)}
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

{#snippet bookCount(count: number)}
  {count} book{count === 1 ? '' : 's'}
{/snippet}
