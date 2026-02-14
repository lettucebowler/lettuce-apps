<script module>
  import * as v from 'valibot';

  const querySchema = v.object({
    start: v.optional(v.pipe(v.string(), v.isoDate()), '1998-01-01'),
    end: v.optional(v.pipe(v.string(), v.isoDate()), new Date().toISOString().slice(0, 10))
  });
</script>

<script lang="ts">
  import { page } from '$app/state';
  import FilteredEntries from '$lib/components/FilteredEntries.svelte';

  const { start, end } = $derived(
    v.parse(querySchema, Object.fromEntries(page.url.searchParams.entries()))
  );
</script>

<main class="space-y-8">
  <h1 class="text-3xl font-bold">Media Log</h1>
  <section class="space-y-6">
    <h2 class="text-2xl font-bold">Books read</h2>
    <FilteredEntries type="book" {start} {end} />
  </section>

  <section class="space-y-6">
    <h2 class="text-2xl font-bold">Movies watched</h2>
    <FilteredEntries type="movie" {start} {end} />
  </section>
</main>
