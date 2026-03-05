<script lang="ts">
  import { validateSearchParams } from 'runed/kit';
  import * as v from 'valibot';

  import FilteredEntries from '$lib/components/FilteredEntries.svelte';
  import DateRangePicker from './DateRangePicker.svelte';
  import { ISODateString, MediaLogFilters, mediaLogFiltersFallbackEnd, mediaLogFiltersFallbackStart } from './schemas';
  import { page } from '$app/state';
  import { parseDate } from '@internationalized/date';

  let { data: params } = $derived(validateSearchParams(page.url, MediaLogFilters));
  let initialValue = $derived(
    params.start === mediaLogFiltersFallbackStart || params.end === mediaLogFiltersFallbackEnd
      ? undefined
      : {
          start: parseDate(params.start),
          end: parseDate(params.end)
        }
  );
</script>

<main class="space-y-8">
  <h1 class="text-3xl font-bold">Media Log</h1>
  <form
    method="get"
    onsubmit={(e) => {
      const formdata = new FormData(e.target as HTMLFormElement);
      const formObject = Object.fromEntries(formdata.entries());
      const validationResult = v.safeParse(
        v.object({
          start: ISODateString,
          end: ISODateString
        }),
        formObject
      );
      if (!validationResult.success) {
        e.preventDefault();
        return;
      }
    }}
  >
    <div class="grid grid-cols-1 items-end gap-4 sm:flex">
      <DateRangePicker startName="start" endName="end" {initialValue} />

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
    <FilteredEntries type="book" start={params.start} end={params.end} />
  </section>

  <section class="space-y-6">
    <h2 class="text-2xl font-bold">Movies watched</h2>
    <FilteredEntries type="movie" start={params.start} end={params.end} />
  </section>
</main>
