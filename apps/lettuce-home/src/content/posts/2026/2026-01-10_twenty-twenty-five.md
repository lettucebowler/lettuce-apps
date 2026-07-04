---
title: 'Twenty Twenty Five'
date: 2026-01-10
summary: End of year vibe check
published: true
tags:
  - 'media-log'
  - 'vibe-check'
---

<script lang="ts">
    import MediaGrid from '$lib/components/MediaGrid.svelte';
    import BookCover from '$lib/components/BookCover.svelte';
    import MoviePoster from '$lib/components/MoviePoster.svelte';
    import { filterBooks, filterMovies } from '$lib/collections';

    let start = '2025-01-01';
    let end = '2025-12-31';

    const books = filterBooks({ start, end });
    const current = [{
      title: 'The Well of Ascension',
      isbn: 9781250868299
    }];
    const movies = filterMovies({ start, end });
</script>

More than half of this month was spent on vacation, but I don't feel like I got much out of it. Every day my wife would
come home from work and when she asked me how my day went, I never had much good to say. It felt Like I wasted a lot of
my time and didn't get the enjoyment that I could have out of it.

I want to be more intentional with my time. I often will go to do something in my office and end up putzing around
instead of doing what I intended to do. That's one thing I'd like to change going into the new year.

<h2 class="text-2xl font-bold">
  Books completed
  &nbsp;
  <span class="font-medium text-charade-100 text-base">{books.length} book{books.length > 1 ? 's' : ''}</span>
</h2>

<MediaGrid>
  {#each books.toReversed() as {title, isbn}, i (`${isbn}-${i}`)}
    <BookCover {title} {isbn} />
  {/each}
</MediaGrid>

The Re Zero Light novel was the book series that got be back into reading as an adult. I am hoping to continue this trend and read even more next year. My goal I am setting myself is 24 books in 2026.

<h2 class=" text-2xl font-bold">
  Movies watched
  &nbsp;
  <span class="font-medium text-charade-100 text-base">{movies.length} movie{movies.length > 1 ? 's' : ''}</span>
</h2>

<MediaGrid>
  {#each movies.toReversed() as {title, tmdb}, i (`${tmdb}-${i}`)}
    <MoviePoster {title} {tmdb} />
  {/each}
</MediaGrid>

A pretty strong selection of movies overall, even if it did end on a weak note. If I had to pick I would nominate Mickey 17, Sinners, and Weapsons to the podium, not sure of the order though.

## Reflection

I spend more than half of December on vacation but I don’t feel like I got much out of it. Every day my wife would come home from work and when she asked me how my day went, I never had much good to say. It felt Like I wasted a lot of my time and didn’t get the enjoyment that I could have out of it.

I want to be more intentional with my time. I often will go to do something in my office and end up putzing around instead of doing what I intended to do. That’s one thing I’d like to change going into the new year.
