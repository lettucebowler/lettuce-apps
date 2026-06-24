<script lang="ts">
  import * as v from 'valibot';
  import { CalendarDate, today } from '@internationalized/date';
  import { ISODateString } from '$lib/schemas';
  import FilteredEntries from '$lib/components/FilteredEntries.svelte';
  import DateRangePicker from './DateRangePicker.svelte';
  import { page } from '$app/state';
  import { DateRangeFromISODateStrings } from '$lib/schemas.js';

  const defaultStart = new CalendarDate(1998, 12, 12);
  const defaultEnd = today('America/Chicago');

  const onSubmit = (e: SubmitEvent) => {
    const formdata = new FormData(e.target as HTMLFormElement);
    const formObject = Object.fromEntries(formdata.entries());
    const validationResult = v.safeParse(
      v.object({
        start: ISODateString,
        end: ISODateString,
      }),
      formObject,
    );
    if (!validationResult.success) {
      e.preventDefault();
      return;
    }
  };

  let { start, end } = $derived.by(() => {
    const input = {
      start: page.url.searchParams.get('start') ?? defaultStart,
      end: page.url.searchParams.get('end') ?? defaultEnd,
    };
    return v.parse(DateRangeFromISODateStrings, input);
  });
</script>

<main class="space-y-8">
  <h1 class="text-3xl font-bold">Media Log</h1>
  <form method="get" onsubmit={onSubmit}>
    <div class="grid grid-cols-1 items-end gap-4 sm:flex">
      <DateRangePicker startName="start" endName="end" initialValue={{ start, end }} />
      <div class="flex gap-4">
        <button
          class="order-1 my-1 box-border h-10.5 cursor-pointer rounded bg-frost-400 px-3 py-1 font-medium text-charade-50 hover:bg-frost-400/90 focus-visible:bg-frost-400/90 active:bg-frost-400/70 sm:order-0"
          >Filter</button
        >
        <a href={new URL(page.url).pathname} class="my-1 ml-auto block h-10.5 py-2 text-charade-100 sm:ml-0"
          >Clear filters</a
        >
      </div>
    </div>
  </form>
  <section class="space-y-6">
    <h2 class="text-2xl font-bold">Books read</h2>
    <FilteredEntries type="book" {start} {end} />
  </section>
  <section class="space-y-6">
    <h2 class="text-2xl font-bold">Movies watched</h2>
    <FilteredEntries type="movie" {start} {end} />
  </section>
</main>
