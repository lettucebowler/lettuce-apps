<script lang="ts">
  import * as v from 'valibot';
  import { CalendarDate, today } from '@internationalized/date';
  import { ISODateString } from '$lib/schemas';
  import DateRangePicker from './DateRangePicker.svelte';
  import { page } from '$app/state';
  import { DateRangeFromISODateStrings } from '$lib/schemas.js';
  import { filterBooks, filterMovies } from '$lib/collections';
  import MediaGrid from '$lib/components/MediaGrid.svelte';
  import MoviePoster from '$lib/components/MoviePoster.svelte';
  import BookCover from '$lib/components/BookCover.svelte';

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
    {let books = $derived(filterBooks({ start, end }))}
    <h2 class="text-2xl font-bold">
      Books completed &nbsp;
      <span class="font-medium text-charade-100 text-base">{books.length} book{books.length !== 1 ? 's' : ''}</span>
    </h2>

    <MediaGrid>
      {#each books as { title, isbn }, i (`${isbn}-${i}`)}
        <BookCover {title} {isbn} />
      {/each}
    </MediaGrid>
  </section>
  <section class="space-y-6">
    {let movies = $derived(filterMovies({ start, end }))}
    <h2 class=" text-2xl font-bold">
      Movies watched &nbsp;
      <span class="font-medium text-charade-100 text-base">{movies.length} movie{movies.length !== 1 ? 's' : ''}</span>
    </h2>

    <MediaGrid>
      {#each movies as { title, tmdb }, i (`${tmdb}-${i}`)}
        <MoviePoster {title} {tmdb} />
      {/each}
    </MediaGrid>
  </section>
</main>
