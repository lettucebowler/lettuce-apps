<script lang="ts">
  import { getMovieById } from '#lib/collections.remote.js';

  let { tmdb, class: classname = 'italic' }: { tmdb: number; class?: string } = $props();
  const movie = $derived(await getMovieById(tmdb));
</script>

<a class={classname} href="https://www.themoviedb.org/movie/{tmdb}">{movie.title}</a>
