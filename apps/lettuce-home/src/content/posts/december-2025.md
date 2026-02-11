---
title: 'December 2025'
date: 2025-01-10
stuff: 2025-01-10
summary: End of year vibe check
published: true
tags:
  - 'media-log'
  - 'vibe-check'
---

<script lang="ts">
    import FilteredEntries from '../../lib/components/FilteredEntries.svelte';

    let formattedDate = new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
</script>

More than half of this month was spent on vacation, but I don't feel like I got much out of it. Every day my wife would
come home from work and when she asked me how my day went, I never had much good to say. It felt Like I wasted a lot of
my time and didn't get the enjoyment that I could have out of it.

I want to be more intentional with my time. I often will go to do something in my office and end up putzing around
instead of doing what I intended to do. That's one thing I'd like to change going into the new year.

## Books completed

I've hardly read anything since July. I would like to try and be more consistent with my reading in the new year.

<FilteredEntries type="book" years={[2025]} months={['12']} />

## Movies watched

I watched a lot of Christmas movies this month to the surprise of no one. It felt good to get into the spirit of the
season. I started listening to a new podcast called RPG Major at the recommendation of my cousing. I'm about 5
episodes in and am liking it so far.

<FilteredEntries type="movie" years={[2025]} months={['12']} />
