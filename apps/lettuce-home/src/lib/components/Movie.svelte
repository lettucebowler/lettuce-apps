<script lang="ts">
  import { type MovieLogEntry } from '$lib/schemas';
  import MediaFigure from './MediaFigure.svelte';
  import MoviePoster from './MoviePoster.svelte';

  let {
    title,
    directors,
    released,
    rewatch,
    rating,
    comment,
    url,
    tmdb,
  }: Pick<MovieLogEntry, 'title' | 'directors' | 'released' | 'rewatch' | 'rating' | 'comment' | 'url' | 'tmdb'> =
    $props();
</script>

<MediaFigure {title} contributors={directors} year={released} {comment} {rating} href={url}>
  {#snippet media()}
    <MoviePoster {tmdb} {title} />
  {/snippet}
  {#snippet feature()}
    {#if rewatch}
      <span class="-m-0.5 icon-[heroicons--arrow-path-16-solid] size-5 text-antique-brass-500" title="rewatch"></span>
    {/if}
  {/snippet}
</MediaFigure>
