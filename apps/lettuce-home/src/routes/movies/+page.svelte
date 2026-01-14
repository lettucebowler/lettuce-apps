<script lang="ts">
  import Movie from '$lib/components/Movie.svelte';
  import MediaCollection from '$lib/components/MediaCollection.svelte';
  import { getMovieLogsDesc } from '$lib/collections';
  let movieLog = getMovieLogsDesc();
</script>

<svelte:head>
  <title>Movies | Grant Montgomery</title>
</svelte:head>
<main class="space-y-8">
  <h1 class="text-3xl font-bold">Movies</h1>
  {#each movieLog as { year, movies } (year)}
    <MediaCollection
      title={year.toString()}
      subtitle={`${movies.length} movie${movies.length === 1 ? '' : 's'}`}
    >
      {#each movies as movie (movie.tmdb + ':' + movie.rating + ':' + movie.watched)}
        <Movie {...movie} />
      {/each}
    </MediaCollection>
  {/each}
  <p class="mx-auto mt-auto text-center">
    Images and data sourced from&nbsp;
    <a class="text-swamp-green-500 hover:underline" href="https://openlibrary.org">
      <img
        alt="tmdb logo"
        class="inline h-2"
        src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
      />
    </a>
  </p>
</main>
