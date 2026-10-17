<script lang="ts">
  import { type MovieLogEntry } from '#lib/schemas.js';
  import MediaFigure from './MediaFigure.svelte';
  import MovieLink from './MovieLink.svelte';
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

<MediaFigure {title} contributors={directors} year={released} {comment} {rating}>
  {#snippet media()}
    <MovieLink {tmdb} class="mb-auto block w-full max-w-60 flex-1 @min-[18.5rem]:max-w-40 @min-[18.5rem]:flex-1">
      <MoviePoster {tmdb} {title} />
    </MovieLink>
  {/snippet}
</MediaFigure>
