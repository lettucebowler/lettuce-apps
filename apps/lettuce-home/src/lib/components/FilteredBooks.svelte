<script lang="ts">
  import { getFilteredBooks } from '$lib/collections';
  type Props = {
    years: number[];
    months: string[];
  };

  const { years, months }: Props = $props();

  const items = $derived(
    getFilteredBooks({
      years,
      months
    })
  );
</script>

<div class="@container">
  <div class="grid grid-cols-[repeat(auto-fill,_minmax(6rem,_1fr))] gap-4">
    {#each items as book (book.isbn)}
      <img src={`/covers/book-${book.isbn}.webp`} class="m-0!" alt={book.title} />
    {/each}
  </div>
</div>
