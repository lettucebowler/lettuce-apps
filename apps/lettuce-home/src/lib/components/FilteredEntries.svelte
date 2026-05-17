<script lang="ts">
  import { filterBooks, filterMovies } from '$lib/collections';
  import type { LogEntry } from '$lib/schemas';
  import type { CalendarDate } from '@internationalized/date';
  type Props = {
    start?: CalendarDate | undefined;
    end?: CalendarDate | undefined;
    type: 'movie' | 'book';
    manualItems?: Array<LogEntry>;
    direction?: 'asc' | 'desc';
  };

  const { start, end, type, manualItems, direction = 'desc' }: Props = $props();

  const items = $derived.by(() => {
    if (manualItems) {
      return manualItems;
    }
    const entries =
      type === 'book'
        ? filterBooks({
            start,
            end,
          })
        : filterMovies({ start, end });
    return direction === 'desc' ? entries : entries.toReversed();
  });
</script>

<div class="@container">
  <div class="grid grid-cols-[repeat(auto-fill,_minmax(6rem,_1fr))] gap-2">
    {#each items as item (`${item.url}:${item.logDate}`)}
      <a title={item.title} href={item.url}
        ><img src={item.imageSrc} class="m-0! aspect-2/3 w-full" alt={item.title} /></a
      >
    {:else}
      <p class="col-span-full">No {type}s within specified date range</p>
    {/each}
  </div>
</div>
