<script lang="ts">
  import { infiniteScrollAction } from './actions.js';
  import { LettuceAvatar } from '@lettuce-apps-packages/svelte-common';
  import GameSummary from './GameSummary.svelte';
  import { browser } from '$app/environment';
  import { createInfiniteQuery } from '@tanstack/svelte-query';
  import { getGameNum } from '$lib/words.js';
  import { createApiWordlettuceClient } from '$lib/api-wordlettuce.js';

  let { data } = $props();
  const gameNum = getGameNum();

  const { getGameResults } = createApiWordlettuceClient({ fetch });
  async function getResults({ start }: { start: number }) {
    return getGameResults({ userID: data.profileUserID, start, limit: 60 });
  }

  let query = createInfiniteQuery(() => ({
    queryKey: ['game-results', data.user, data.start],
    initialPageParam: data.start,
    getNextPageParam(lastPage) {
      return lastPage.next ? lastPage.next : undefined;
    },
    queryFn: ({ pageParam }) => getResults({ start: pageParam }),
    initialData: {
      pageParams: [data.start],
      pages: [{ results: data.pastResults, start: data.start, next: data.next }],
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  }));
</script>

<svelte:body
  use:infiniteScrollAction={{
    distance: 1000,
    cb: () => {
      if (!query.isFetchingNextPage) {
        query?.fetchNextPage();
      }
    },
    immediate: true,
    disabled: !data.next || data.start !== gameNum || !query.hasNextPage,
  }}
/>
<main class="flex w-full flex-col gap-8">
  <div>
    <figure class="flex flex-col gap-2">
      <div class="text-snow-300 bg-charade-700 mx-auto h-40 w-40 overflow-hidden rounded-3xl text-3xl shadow-lg">
        <LettuceAvatar name={data.profileUser} />
      </div>
      <figcaption class="text-snow-300 text-center text-xl font-medium">
        {data.profileUser}
      </figcaption>
    </figure>

    {#if data.user?.username === data.profileUser}
      <div class="flex justify-center">
        <a
          class="text-snow-100 block grid h-full items-center rounded-xl px-6 py-2 text-center font-medium capitalize hover:underline"
          href="/signout">Sign out</a
        >
      </div>
    {/if}
  </div>

  {#if data.currentResults.length}
    <h1 class="text-snow-300 text-center text-3xl font-bold">Recent Games</h1>

    <p class="text-snow-300 text-center text-xl">
      These games contribute to {data.profileUser}'s rolling 7-day score of {data.currentResults
        .map((r) => r.score)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0)}
    </p>

    <div class="mx-auto grid w-full grid-cols-2 justify-center gap-2 px-1 sm:flex sm:flex-wrap sm:gap-3">
      {#each data.currentResults as gameResult (gameResult)}
        <div
          class={[
            'flex flex-col gap-2 sm:shrink-0',
            [7, 4].includes(data.currentResults.length) && 'sm:basis-[calc((100%-36px)/4)]',
            [6, 5, 3].includes(data.currentResults.length) && 'sm:basis-[calc((100%-24px)/4)]',
            [2].includes(data.currentResults.length) && 'sm:basis-[calc((100%-12px)/4)]',
            [1].includes(data.currentResults.length) && 'sm:basis-[25%]',
          ]}
        >
          <h2 class="text-snow-300 flex justify-between text-center text-xl font-medium">
            <span class="text-left">#{gameResult.gameNum}</span><span class="text-right">{gameResult.score} pts</span>
          </h2>
          <GameSummary radius="md" answers={gameResult.answers} />
        </div>
      {/each}
    </div>
  {/if}

  {#if data.pastResults.length}
    <h2 class="text-snow-300 text-center text-3xl font-bold">Play History</h2>

    <div class="grid w-full grid-cols-2 gap-2 px-1 sm:grid-cols-3 sm:gap-3">
      {#if query.data}
        {#each query.data.pages ?? [] as page (page)}
          {#each page.results as gameResult (gameResult)}
            <div class="flex w-full flex-[1_1_200px] flex-col gap-2 rounded-2xl">
              <h2 class="text-snow-300 flex justify-between text-center text-xl font-medium">
                <span class="text-left">#{gameResult.gameNum}</span><span class="text-right"
                  >{gameResult.score} pts</span
                >
              </h2>
              <GameSummary answers={gameResult.answers} />
            </div>
          {/each}
        {/each}
      {/if}
    </div>
  {/if}
  {#if !data.currentResults.length && !data.currentResults.length}
    <div class="text-snow-300 col-span-3 text-center text-lg font-medium">This user has no play history</div>
  {/if}

  {#if browser && query.hasNextPage && data.start === gameNum}
    <div class="flex flex-col items-center gap-2">
      <svg class="text-snow-100 h-8 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="text-charade-800" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p class="text-snow-100 text-center text-xl font-medium">loading...</p>
    </div>
  {:else if data.start < gameNum || !browser}
    <nav class="mx-4 flex justify-end gap-2">
      {#if data.start < gameNum}
        <a
          href="?start={gameNum}"
          title="Back to start"
          class="text-snow-300 mr-auto text-lg font-medium hover:underline">Back to start</a
        >
      {/if}
      {#if data.next}
        <a
          href="?start={data.next}&prevStart={data.start}"
          title="Next"
          class="text-snow-300 text-lg font-medium hover:underline">Next</a
        >
      {/if}
    </nav>
  {/if}
</main>
<div class="h-2"></div>
