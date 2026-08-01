<script module lang="ts">
  const COLOR_NEW_BOOKS = 'var(--color-swamp-green-500)';
  const COLOR_REREAD_BOOKS = 'var(--color-swamp-green-700)';
  const COLOR_NEW_MOVIES = 'var(--color-frost-200)';
  const COLOR_REWATCHED_MOVIES = 'var(--color-frost-400)';

  type BarSlot = 'books' | 'movies';
  type Datum = {
    month: number;
    label: string;
    newBooks: number;
    rereadBooks: number;
    newMovies: number;
    rewatchedMovies: number;
  };

  type Props = {
    year: number;
  };

  const groupScale = scaleBand<BarSlot>().domain(['books', 'movies']).paddingInner(0.08);

  const periods = [
    { month: 1, label: 'January' },
    { month: 2, label: 'February' },
    { month: 3, label: 'March' },
    { month: 4, label: 'April' },
    { month: 5, label: 'May' },
    { month: 6, label: 'June' },
    { month: 7, label: 'July' },
    { month: 8, label: 'August' },
    { month: 9, label: 'September' },
    { month: 10, label: 'October' },
    { month: 11, label: 'November' },
    { month: 12, label: 'December' },
  ];
</script>

<script lang="ts">
  import { barY, defineChart, group } from '@tanstack/charts';
  import { scaleBand, scaleLinear } from 'd3-scale';
  import { parseDate } from '@internationalized/date';
  import { dedupe, getBooksInDateRange, getMoviesInDateRange } from '#lib/collections';
  import { Chart } from '@tanstack/svelte-charts';
  import { tooltip } from '@tanstack/charts/tooltip';

  let { year }: Props = $props();

  let definition = $derived.by(() => {
    const dateRange = { start: parseDate(`${year}-01-01`), end: parseDate(`${year}-12-31`) };
    const books = getBooksInDateRange(dateRange);
    const movies = getMoviesInDateRange(dateRange);
    const rows = periods.map((period) => {
      const booksByMonth = dedupe(
        books.filter((book) => parseDate(book.logDate).month === period.month),
        (book) => book.isbn,
      );
      const moviesByMonth = dedupe(
        movies.filter((movie) => parseDate(movie.logDate).month === period.month),
        (movie) => movie.tmdb,
      );
      const rereadBooks = booksByMonth.filter((book) => book.reread).length;
      const rewatchedMovies = moviesByMonth.filter((movie) => movie.rewatch).length;
      return {
        ...period,
        newBooks: booksByMonth.length - rereadBooks,
        rereadBooks,
        newMovies: moviesByMonth.length - rewatchedMovies,
        rewatchedMovies,
      };
    });
    return defineChart<Datum, number, number>(
      {
        marks: [
          barY(rows, {
            x: 'month',
            y1: 0,
            y2: (row) => row.newBooks + row.rereadBooks,
            z: () => 'books',
            fill: COLOR_NEW_BOOKS,
            layout: group({ scale: groupScale }),
            inset: 1,
            id: 'newBooks',
          }),
          barY(rows, {
            x: 'month',
            y1: 'newBooks',
            y2: (row) => row.newBooks + row.rereadBooks,
            z: () => 'books',
            fill: COLOR_REREAD_BOOKS,
            layout: group({ scale: groupScale }),
            inset: 1,
            id: 'rereadBooks',
          }),
          barY(rows, {
            x: 'month',
            y1: 0,
            y2: 'newMovies',
            z: () => 'movies',
            fill: COLOR_NEW_MOVIES,
            layout: group({ scale: groupScale }),
            inset: 1,
            id: 'newMovies',
          }),
          barY(rows, {
            x: 'month',
            y1: 'newMovies',
            y2: (row) => row.newMovies + row.rewatchedMovies,
            z: () => 'movies',
            fill: COLOR_REWATCHED_MOVIES,
            layout: group({ scale: groupScale }),
            inset: 1,
            id: 'rewatchedMovies',
          }),
        ],
        x: {
          scale: () => scaleBand<number>().paddingInner(0.2).paddingOuter(0.1),
          axis: {
            ticks: {
              format: (value) => periods.find((period) => period.month === value)!.label,
            },
            label: 'Month',
          },
        },
        y: {
          scale: scaleLinear,
          grid: true,
          axis: {
            ticks: { count: 2, format: (value) => Math.round(value).toString() },
            label: 'Count',
          },
        },
        margin: { top: 30, right: 30, bottom: 50, left: 50 },
      },
      {
        tooltip: {
          use: tooltip,
          anchor: 'group-center',
          placement: ['top', 'right', 'left', 'bottom'],
          className: 'bg-charade-800! text-snow-300! shadow-sm',
        },
        focus: 'group-x',
      },
    );
  });
</script>

<div class="text-lg!">
  <h2 class="text-center text-xl font-bold">Books and Movies By Month in {year}</h2>
  <Chart {definition} ariaLabel="Revenue by month" initialWidth={768} aspectRatio={3}>
    {#snippet tooltipBody(a)}
      {#each a.points.slice(0, 1) as point, i (i)}
        <span class="text-center text-base font-bold">{point.datum.label}</span>
        <dl class="grid! grid-cols-[max-content_1fr]! gap-x-[1ch]! text-sm!">
          {#if point.datum.newBooks}
            <dt class="after:content-[':']">
              <span>
                <div class="inline-block size-3 rounded-full" style="background-color: {COLOR_NEW_BOOKS}"></div>
                New books
              </span>
            </dt>
            <dd class="font-bold">{point.datum.newBooks}</dd>
          {/if}
          {#if point.datum.rereadBooks}
            <dt class="after:content-[':']">
              <span>
                <div class="inline-block size-3 rounded-full" style="background-color: {COLOR_REREAD_BOOKS}"></div>
                Reread books
              </span>
            </dt>
            <dd class="font-bold">{point.datum.rereadBooks}</dd>
          {/if}
          {#if point.datum.newMovies}
            <dt class="after:content-[':']">
              <span>
                <div class="inline-block size-3 rounded-full" style="background-color: {COLOR_NEW_MOVIES}"></div>
                New movies
              </span>
            </dt>
            <dd class="font-bold">{point.datum.newMovies}</dd>
          {/if}
          {#if point.datum.rewatchedMovies}
            <dt class="after:content-[':']">
              <span>
                <div class="inline-block size-3 rounded-full" style="background-color: {COLOR_REWATCHED_MOVIES}"></div>
                Rewatched movies
              </span>
            </dt>
            <dd class="font-bold">{point.datum.rewatchedMovies}</dd>
          {/if}
        </dl>
      {/each}
    {/snippet}
  </Chart>
</div>
