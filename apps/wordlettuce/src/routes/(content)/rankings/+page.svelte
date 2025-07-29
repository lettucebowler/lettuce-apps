<script lang="ts">
  import FireIcon from '$lib/components/FireIcon.svelte';
  import { LettuceAvatar } from '@lettuce-apps-packages/svelte-common';
  import Spinner from '../Spinner.svelte';
  let { data } = $props();
</script>

<main class="grid gap-8">
  <h1 class="text-snow-300 text-center text-3xl font-bold">LeaderBoard</h1>
  <p class="text-snow-300 box-border px-4 text-left text-lg">
    Each successful game earns 1 point, plus a bonus point for the number of guesses under 6 it took to guess the word.
    6 guesses is 1 point. 5 guesses is 2 points, etc. Score below is total of last 7 days.
  </p>
  {#await data.rankings}
    <Spinner />
  {:then rankings}
    {#if rankings.length}
      <div
        class="bg-charade-700 border-box text-snow-200 grid w-full gap-x-2 gap-y-[1px] overflow-hidden sm:grid-cols-[1fr_max-content] sm:gap-x-4 sm:rounded-xl sm:text-xl sm:shadow-lg"
      >
        <div class="bg-charade-700 hidden grid-cols-subgrid p-4 sm:col-span-2 sm:grid">
          <div class="font-bold capitalize">user</div>
          <div class="hidden text-right font-bold capitalize sm:block">score</div>
        </div>
        {#each rankings as ranking, i (i)}
          {@const position = rankings.filter((s) => s.score > ranking.score).length + 1}
          <a
            class="bg-charade-900 sm:bg-charade-950 hover:bg-charade-800 grid grid-cols-subgrid px-4 py-2 sm:col-span-2"
            href={`/profile/${ranking.user}`}
          >
            <div class="flex items-center gap-4">
              #{position}
              <div class="size-8 overflow-hidden rounded sm:size-11">
                <LettuceAvatar name={ranking.user} />
              </div>
              {ranking.user}
              {#if position === 1}
                <div class="text-antique-brass-500 my-auto size-6 animate-pulse">
                  <FireIcon />
                </div>
              {/if}
              <span class="ml-auto text-right sm:hidden">
                {ranking.score}pts
              </span>
            </div>
            <div class="hidden items-center justify-end text-right sm:flex">
              {ranking.score}
            </div>
          </a>
        {/each}
      </div>
    {:else}
      <p class="text-snow-300 box-border px-4 text-left text-lg">
        No game results from the last 7 days. Play now and take the #1 spot!
      </p>
    {/if}
  {/await}
</main>
