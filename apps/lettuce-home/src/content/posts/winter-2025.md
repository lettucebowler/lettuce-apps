---
title: 'Winter 2025'
date: 2025-01-10
summary: End of year vibe check
published: false
---

<script lang="ts">
    import MediaCollection from '../../lib/components/MediaCollection.svelte';
    import Book from '../../lib/components/Book.svelte';
    import Movie from '../../lib/components/Movie.svelte';
    import { getReadingLogsDesc, getMovieLogsDesc } from '../../lib/collections.ts';

    let bookData = getReadingLogsDesc();
    let movieData = getMovieLogsDesc();
</script>

# { title }

I watched a lot of Christmas movies this month to the surprise of no one. It felt good to get into the spirit of the
season. I started listening to a new podcast called RPG Major at the recommendation of my cousing. I'm about 5
episodes in and am liking it so far.

More than half of this month was spent on vacation, but I don't feel like I got much out of it. Every day my wife would
come home from work and when she asked me how my day went, I never had much good to say. It felt Like I wasted a lot of
my time and didn't get the enjoyment that I could have out of it.

I want to be more intentional with my time. I often will go to do something in my office and end up putzing around
instead of doing what I intended to do. That's one thing I'd like to change going into the new year.

## Books completed

<div class="@container">
    <div class="grid grid-cols-[repeat(auto-fill,_minmax(6rem,_1fr))] gap-4">
    {#each bookData
      .find((year) => {
        return year.title === '2025';
      })!
      .items.filter((book) => book.completed && book.completed >= '2025-10') as book (book.isbn)}
        <img
            src="{`/covers/book-${book.isbn}.webp`}" class="m-0!"
            alt="{book.title}"
        />
      {/each}
  </div>    
</div>

## Movies watched

<div class="@container">
    <div class="grid grid-cols-[repeat(auto-fill,_minmax(6rem,_1fr))] gap-4">
        {#each movieData
            .find((year) => {
                return year.year === 2025;
            })!
            .movies.filter((item) => item.watched && item.watched >= '2025-10') as item (item.tmdb)}
        <img
            src="{`/posters/movie-${item.tmdb}.webp`}" class="m-0!"
            alt={item.title}
        />
      {/each}
  </div>    
</div>
