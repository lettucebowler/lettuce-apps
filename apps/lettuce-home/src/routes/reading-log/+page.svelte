<script lang="ts">
  import Book from '../../lib/components/Book.svelte';
  import MediaCollection from '$lib/components/MediaCollection.svelte';
  import { getCurrentlyReading, getReadingLogsDesc } from '$lib/collections';
  import MediaFigure from '$lib/components/MediaFigure.svelte';
  import { today } from '@internationalized/date';

  const current = getCurrentlyReading();
  const completed = getReadingLogsDesc();
</script>

<svelte:head>
  <title>Reading log | Grant Montgomery</title>
</svelte:head>
<main class="space-y-8">
  <h1 class="text-3xl font-bold first-letter:capitalize">Books</h1>
  <!-- {#if current.length}
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
  {/if} -->
  {#each completed as { year, books } (year)}
    <MediaCollection>
      {#snippet title()}
        {year}
      {/snippet}
      {#snippet subtitle()}
        {@render bookCount(books.length)}
      {/snippet}
      {#if year === today('America/Chicago').year}
        {#each current as book (book.isbn)}
          <MediaFigure
            title={book.title}
            subtitle={book.subtitle}
            contributors={book.authors}
            year={book.published}
            imageSrc={book.imageSrc}
            href={book.url}
          >
            {#snippet feature()}
              <p class="-mt-1 font-medium text-antique-brass-500">in-progress</p>
            {/snippet}
          </MediaFigure>
        {/each}
      {/if}
      {#each books as book (book.isbn)}
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
