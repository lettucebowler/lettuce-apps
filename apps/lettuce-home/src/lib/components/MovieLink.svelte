<script lang="ts">
  import { getMovieById } from '#lib/collections.js';

  let { tmdb, class: classname = 'italic' }: { tmdb: number; class?: string } = $props();
  const movie = $derived.by(() => {
    const movieReference = getMovieById(tmdb);
    if (!movieReference) {
      throw new Error('Movie not found in collection');
    }
    return movieReference;
  });
</script>

<a class={classname} href="https://www.themoviedb.org/movie/{tmdb}">{movie.title}</a>
