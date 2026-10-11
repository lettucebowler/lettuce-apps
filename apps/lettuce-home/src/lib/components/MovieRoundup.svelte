<script lang="ts">
  import { getMoviesInDateRange } from '#lib/collections.remote.js';
  import { parseDate } from '@internationalized/date';
  import MediaGrid from './MediaGrid.svelte';
  import MoviePoster from './MoviePoster.svelte';
  import { dedupe } from '#lib/utils.js';

  type Props = {
    start: string;
    end: string;
  };

  let { start, end }: Props = $props();
  let { startDate, endDate } = $derived({ startDate: parseDate(start), endDate: parseDate(end) });
  let movies = $derived(
    dedupe((await getMoviesInDateRange({ start: startDate, end: endDate })).toReversed(), (movie) => movie.tmdb),
  );
</script>

<h2 class="text-2xl font-bold">
  Movies watched &nbsp;
  <span class="text-base font-medium text-charade-100">{movies.length} movie{movies.length > 1 ? 's' : ''}</span>
</h2>

<MediaGrid>
  {#each movies as { title, tmdb }, i (`${tmdb}-${i}`)}
    <MoviePoster {title} {tmdb} />
  {/each}
</MediaGrid>
