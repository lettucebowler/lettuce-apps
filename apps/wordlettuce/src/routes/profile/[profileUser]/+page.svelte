<script lang="ts">
  import { LettuceAvatar } from '@lettuce-apps-packages/svelte-common';
  import GameSummary from './GameSummary.svelte';
  import { browser } from '$app/environment';
  import { createInfiniteQuery } from '@tanstack/svelte-query';
  import { getGameNum } from '$lib/words.js';
  import { createApiWordlettuceClient } from '$lib/api-wordlettuce';
  import { infiniteScroll } from './infinite-scroll.svelte.js';

  let { data } = $props();
  const gameNum = getGameNum();

  let isSelf = $derived(data.user?.username === data.profileUser);

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
  {@attach infiniteScroll({
    distance: 1000,
    cb: () => {
      if (!query.isFetchingNextPage) {
        query?.fetchNextPage();
      }
    },
    immediate: true,
    disabled: !data.next || data.start !== gameNum || !query.hasNextPage,
  })}
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

    {#if isSelf}
      <div class="flex justify-center">
        <a
          class="text-snow-100 grid h-full items-center rounded-xl px-6 py-2 text-center font-medium capitalize hover:underline"
          href="/signout">Sign out</a
        >
      </div>
    {/if}
  </div>

  {#if data.currentResults.length}
    <h1 class="text-snow-300 text-center text-3xl font-bold">Recent Games</h1>
    <p class="text-snow-300 text-center text-xl">
      These games contribute to {data.profileUser}'s rolling 7-day score of {data.currentResults.reduce(
        (accumulator, currentValue) => accumulator + currentValue.score,
        0,
      )}
    </p>
    <div class="mx-auto grid w-full grid-cols-2 gap-2 px-1 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
      {#each data.currentResults as gameResult (gameResult)}
        <div
          class={[
            [7, 4].includes(data.currentResults.length) && 'sm:basis-[calc((100%-36px)/4)]',
            [6, 5, 3].includes(data.currentResults.length) && 'sm:basis-[calc((100%-24px)/4)]',
            [2].includes(data.currentResults.length) && 'sm:basis-[calc((100%-12px)/4)]',
            [1].includes(data.currentResults.length) && 'sm:basis-[25%]',
          ]}
        >
          <GameSummary {...gameResult} enableShare={isSelf} />
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
            <GameSummary {...gameResult} enableShare={isSelf} />
          {/each}
        {/each}
      {/if}
      {#if browser && query.hasNextPage && data.start === gameNum}
        <div class="col-span-2 flex flex-col items-center gap-2 sm:col-span-3">
          <svg
            class="text-snow-100 h-8 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="text-charade-800" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p class="text-snow-100 text-center text-xl font-medium">loading...</p>
        </div>
      {:else if data.start < gameNum || !browser}
        <nav class="col-span-2 flex justify-end gap-2 sm:col-span-3">
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
    </div>
  {/if}

  {#if !data.currentResults.length && !data.pastResults.length}
    <div class="text-snow-300 col-span-3 text-center text-lg font-medium">This user has no play history</div>
  {/if}
</main>
