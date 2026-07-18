<script lang="ts">
  import { dedupe, getBooksInDateRange } from '$lib/collections';
  import { parseDate } from '@internationalized/date';
  import MediaGrid from './MediaGrid.svelte';
  import BookCover from './BookCover.svelte';

  type Props = {
    start: string;
    end: string;
  };

  let { start, end }: Props = $props();
  let { startDate, endDate } = $derived({ startDate: parseDate(start), endDate: parseDate(end) });
  let books = $derived(
    dedupe(getBooksInDateRange({ start: startDate, end: endDate }).toReversed(), (book) => book.isbn),
  );
</script>

<h2 class="text-2xl font-bold">
  Books completed &nbsp;
  <span class="text-base font-medium text-charade-100">{books.length} book{books.length > 1 ? 's' : ''}</span>
</h2>

<MediaGrid>
  {#each books as { title, isbn }, i (`${isbn}-${i}`)}
    <BookCover {title} {isbn} />
  {/each}
</MediaGrid>
