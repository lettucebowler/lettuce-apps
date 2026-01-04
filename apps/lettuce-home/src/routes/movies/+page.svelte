<script lang="ts">
  import { getMovieLog } from '$lib/remote/movie-log.remote';
  import Movie from '$lib/components/Movie.svelte';
  const movieLog = await getMovieLog();
</script>

<main class="flex w-full flex-1 flex-col gap-6">
  <h1 class="text-3xl font-bold">Movies</h1>
  <div class="flex flex-col gap-8">
    {#each Object.keys(movieLog).sort().reverse() as year (year)}
      {@const yearMovies = movieLog[year]}
      <div class="grid gap-3">
        <span>
          <h2 class="mr-3 inline-block text-2xl font-bold">{year}</h2>
          <span>{yearMovies!.length} {yearMovies!.length > 1 ? 'movies' : 'movie'}</span>
        </span>
        <div class="grid grid-cols-[repeat(auto-fill,_minmax(10rem,_1fr))] gap-6">
          {#each yearMovies as movie (movie.tmdb)}
            <Movie {...movie} />
          {/each}
        </div>
      </div>
    {/each}
  </div>
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
