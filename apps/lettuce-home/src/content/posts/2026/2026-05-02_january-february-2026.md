---
title: 'January-February 2026'
date: 2026-03-01
published: true
tags:
  - media-log
---

<script lang="ts">
    import MediaGrid from '$lib/components/MediaGrid.svelte';
    import BookCover from '$lib/components/BookCover.svelte';
    import MoviePoster from '$lib/components/MoviePoster.svelte';
    import { filterBooks, filterMovies } from '$lib/collections';

    let start = '2026-01-01';
    let end = '2026-02-28';

    const books = filterBooks({ start, end });
    const current = [
      {
        title: 'A Parade of Horribles',
        isbn: '9798217190065',
      },
      {
        title: 'The Subtle Knife',
        isbn: '9780440418610'
      }
    ];
    const movies = filterMovies({ start, end });
</script>

I'm trying out doing bi-monthly roundups of the books I've read and movies that I've watched. Who knows if this is something that I keep doing long-term but I will try at least for a few months. I also retroactively wrote up a roundup for december of 2025.

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

I set myself a goal of reading 24 books this year. One month in and I'm already a quarter of the way there! I started
reading Matt Dinniman's <a class="text-putty-500 italic" href="https://openlibrary.org/search?q=subject_key%3A%22seriesdungeon_crawler_carl%22" target="_blank">Dungeon Crawler Carl</a>
series and got hooked pretty quickly. I tore through all 7 currently-released books in just two months so that is a good indicator of how much I enjoyed the series. It's a strong recommend from me. The next book comes out in May and I am very much looking forward to it.

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

I started A Parade of Horribles (unreleased) and <a class="italic" href="https://openlibrary.org/isbn/9780440418610">The Subtle Knife</a>, but didn't finish them in time. I am liking them so far so they will likely be the first entries in my March reading log.

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

Lots of movies. Quite a few of them were rewatches, but I also watched a number of other movies that I would definitely see myself watching again in the future. It surpassed my expectations. The Golden Compass movie was terrible in a way that sorta made me like it. I didn't have high expectations for the <a href="https://www.themoviedb.org/movie/1087192" class="italic">How to Train Your Dragon</a> life action remake, but I was pleasantly surprised. I haven't seen the original for a while, so I forgot most of the story. I really liked it.

Most of the movies I watch are older releases. A movie has to really jump out at me to get me to go see it in theaters, and that's what <a href="https://www.themoviedb.org/movie/1119449" class="italic">Good Luck, Have Fun, Don't Die</a> and <a class="text-putty-500 italic" href="https://www.themoviedb.org/movie/1198994">Send Help</a> did. Send Help surpassed my expectations.

## Shows I've been watching

I'm not keeping up with very many weekly shows right now. The two main ones are the second season of <a class="italic" href="https://www.thetvdb.com/series/sousou-no-frieren">Frieren: Beyond Journey's End</a> and <a class="italic" href="https://www.thetvdb.com/series/sentenced-to-brave-punishment">Sentenced to be a Hero</a>.
At some point I will get caught up on <a class="italic" href="https://thetvdb.com/series/jujutsu-kaisen">Jujutsu Kaisen</a> but haven't managed it yet. I finished season 2 of <a class="italic" href="https://www.thetvdb.com/series/fallout">Fallout</a> and would say that I was whelmed. My wife and I watched the first season of <a class="italic" href="https://thetvdb.com/series/the-white-lotus">The White Lotus</a>, which I enjoyed, but she wasn't too impressed with it. We finished the first season of <a class="italic" href="https://www.themoviedb.org/tv/82782-the-righteous-gemstones?language=en-US">The Righteous Gemstones</a> and so far are really enjoying the character development.

## Reflection

### What went well this month

#### Book club

I started going a book club with my wife, starting with The Golden Compass. It's been really fun to regularly talk to each other about the book as we go, discuss questions and theories that we have and what we hope happens next in the story. I ended up really liking the book and plan to finish the six-book series.

#### Reading every day

I don't think I've missed a day yet this year. As of 02/28/2026, I have completed 10 books. That puts me well above pace for my 24 book goal this year. Even if I don't count the two books from the start of the year that carried over from last year, that still puts me at 4 books ahead of schedule. I would never set myself a goal of more than 24 books in a year, but if I naturally exceed that then that's perfectly fine and good. I want the books I read to be because I enjoyed them and not because I felt like I had to finish my homework.

### What didn't go well this month

#### I need to work out more

I set myself a goal of working out more this year and so far I have worked out 10 times. That's only an average of about once per week. I would like to get to at least 3 times each week. One mistake I made was trying to get back into weight lifting based on how I used to train when I was in college and did it regularly. I pushed myself too hard too early and hurt my knee.

#### I'm not drinking nearly enough water

Originally I set myself a goal of drinking 120 ounces of water every day. After tracking my success (or more accurately lack of) for the last few months of 2026, I decided to lower my goal to 80 oz each day to give myself a higher chance of success. I though that it was better to get a quick win to build morale and then iteratively improve until get to my original goal of 120 oz. So far that strategy has not worked out.

### What I am going to try to do differently

I am going to prioritize building my habit of working out first before I try to get back to where I was 7 years ago at the peak of my lifting journey. I won't ever get there if I keep failing to jump from nothing to lifting heavy 5 days a week. I struggle with an all-or-nothing mindset so when I fail at the obviously too difficult first step, I end up giving up. Improving iteratively from where I am will make any individual failure less of a setback.

New rule: The only non-water beverage I am allowed to drink before I have had 80 oz of water on any given day is a protein shake or milk. I don't like drinking milk, so if I want something other than water or Premier Protein, I need to get chugging.
