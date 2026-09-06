<script lang="ts">
  import { type MovieLogEntry } from '#lib/schemas.js';
  import MediaFigure from './MediaFigure.svelte';
  import MoviePoster from './MoviePoster.svelte';

  let {
    title,
    directors,
    released,
    rating,
    comment,
    tmdb,
  }: Pick<MovieLogEntry, 'title' | 'directors' | 'released' | 'rewatch' | 'rating' | 'comment' | 'tmdb'> = $props();
</script>

<MediaFigure
  {title}
  contributors={directors}
  year={released}
  {comment}
  {rating}
  href="https://www.themoviedb.org/movie/{tmdb}"
>
  {#snippet media()}
    <MoviePoster {tmdb} {title} />
  {/snippet}
  <!-- {#snippet feature()}
    {#if rewatch}
      <span class="-m-0.5 icon-[heroicons--arrow-path-16-solid] size-5 text-antique-brass-500" title="rewatch"></span>
    {/if}
  {/snippet} -->
</MediaFigure>
