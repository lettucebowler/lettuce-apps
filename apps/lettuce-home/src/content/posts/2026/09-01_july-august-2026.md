---
title: 'July-August 2026'
date: 2026-08-31
published: true
tags:
  - media-log
  - vibe-check
---

<script lang="ts">
    import MediaGrid from '#lib/components/MediaGrid.svelte';
    import BookCover from '#lib/components/BookCover.svelte';
    import BookRoundup from '#lib/components/BookRoundup.svelte';
    import MovieRoundup from '#lib/components/MovieRoundup.svelte';

    let start = '2026-07-01';
    let end = '2026-08-31';

    const current = [{
      title: 'The Strength of the Few',
      isbn: 9781982141233
    }];
</script>

<BookRoundup { start } { end } />

I started the Throne of Glass series and have been enjoying it. It's a fun series, if not sometimes a little ridiculous. The writing can get a bit repetitive but the story is entertaining and I continue to want to know what happens next.

<h2 class=" text-2xl font-bold">
  Books carried over
  &nbsp;
  <span class="font-medium text-charade-100 text-base">{current.length} book{current.length > 1 ? 's' : ''}</span>
</h2>

<MediaGrid>
  {#each current.toReversed() as {title, isbn}, i (`${isbn}-${i}`)}
    <BookCover {title} {isbn} />
  {/each}
</MediaGrid>

I had originally started this book at the same time as Heir of Fire but these Throne of Glass books have been so entertaining that I just immediately started the next one and sorta forgot that I had started this one. I intend to finish it this month alongside James Islington's new September 1 release, Scion. I'm excited for it!

<MovieRoundup { start } { end } />

The highlight movie these last two months was probably the new Spiderman movie, but it didn't have much to contend with. I haven't watched Shrek the Third since it was in theaters. The only thing I remembered from it was that Shrek throws a bottle at a ship. I forgot how funny these movies are!
