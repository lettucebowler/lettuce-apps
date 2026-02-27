<script lang="ts">
  import { type MovieLogEntry } from '$lib/schemas';
  import LogEntry from './LogEntry.svelte';

  let { tmdb, title, directors, released, rewatch, rating, comment, watched }: MovieLogEntry =
    $props();

  function createAnchorName(tmdb: number, watched: string) {
    return `movie-${tmdb}-${watched}`;
  }
</script>

<LogEntry
  type="movie"
  {title}
  year={released}
  contributors={directors}
  id={tmdb}
  revisited={rewatch}
  {comment}
  {rating}
  completed={watched}
/>
