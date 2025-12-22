<script lang="ts">
  import FireIcon from '$lib/components/icons/FireIcon.svelte';
  import { LettuceAvatar } from '@lettuce-apps-packages/svelte-common';
  import { getRankings } from '$lib/api-wordlettuce';
  import { hydratable } from 'svelte';

  const rankings = await hydratable('rankings', () => getRankings());
</script>

<main class="grid gap-8">
  <h1 class="text-snow-300 mt-4 text-center text-3xl font-bold">LeaderBoard</h1>
  <p class="text-snow-300 box-border px-4 text-left text-lg">
    Each successful game earns 1 point, plus a bonus point for the number of guesses under 6 it took to guess the word.
    6 guesses is 1 point. 5 guesses is 2 points, etc. Score below is total of last 7 days.
  </p>
  <div class="text-snow-200 mx-auto w-full rounded-xl sm:text-xl">
    {#each rankings as ranking, i (i)}
      <a
        class="bg-charade-900 hover:bg-charade-950 not-last:border-charade-600 block px-4 py-2 not-last:border-b first:rounded-t-xl last:rounded-b-xl"
        href={`/profile/${ranking.user}`}
      >
        <div class="flex items-center gap-4">
          {#if ranking.position === 1}
            <div class="text-antique-brass-500 my-auto size-6 animate-pulse">
              <FireIcon />
            </div>
          {:else}
            #{ranking.position}
          {/if}
          <div class="bg-charade-700 size-8 overflow-hidden rounded shadow-md sm:size-11">
            <LettuceAvatar name={ranking.user} />
          </div>
          {ranking.user}

          <span class="ml-auto text-right">
            {ranking.score}pts
          </span>
        </div>
      </a>
    {:else}
      <p class="text-snow-300 box-border px-4 text-lg text-center font-medium animate-pulse">
        No game results from the last 7 days. Play now and take the #1 spot!
      </p>
    {/each}
  </div>
</main>
