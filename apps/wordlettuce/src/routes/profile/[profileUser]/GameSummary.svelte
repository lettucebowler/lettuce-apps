<script lang="ts">
  import { browser } from '$app/environment';
  import ShareIcon from '$lib/components/icons/ShareIcon.svelte';
  import { getGameStatus } from '$lib/util';
  import { appName } from '$lib/app-constants';
  import { toastError, toastSuccess } from '../../toast';
  import {
    LETTER_STATUS_CONTAINS,
    LETTER_STATUS_EXACT,
    LETTER_STATUS_INCORRECT,
    LETTER_STATUS_NONE,
  } from '$lib/game-schemas';

  type GameSummaryProps = {
    answers: string;
    gameNum: number;
    score: number;
    enableShare: boolean;
  };
  let { answers, gameNum, score, enableShare }: GameSummaryProps = $props();

  let shareEnabled = $derived(browser && enableShare);

  function chunkArray(arr: string, n: number) {
    const result = [];
    for (let i = 0; i < arr.length; i += n) {
      result.push(arr.slice(i, i + n));
    }
    return result;
  }

  function shareGame() {
    if (!navigator?.clipboard) {
      return;
    }

    navigator.clipboard
      .writeText(getGameStatus({ gameNum, answers: chunkArray(answers, 5), appName }))
      .then(() => {
        toastSuccess(`Game ${gameNum} result copied to clipboard`);
      })
      .catch(() => {
        toastError('Oppsie :(');
      });
  }
</script>

<button class="flex w-full flex-col gap-2" onclick={() => shareGame()} title="Copy game result to clipboard">
  <h2 class="text-snow-300 flex justify-between text-center text-xl font-medium">
    <span class="text-left">#{gameNum}</span><span class="text-right">{score} pts</span>
  </h2>
  <div class="group @container relative grid grid-cols-5 gap-1">
    {#each [...Array(30).keys()] as i}
      {@const answer = answers.slice(-30).charAt(i) || LETTER_STATUS_NONE}
      <div
        data-answer={answer}
        class={[
          'aspect-square w-full rounded-xs @min-[170px]:rounded-sm @min-[200px]:rounded @min-[230px]:rounded-lg',
          answer === LETTER_STATUS_NONE
            ? 'bg-charade-950'
            : 'border-t-[1px] border-(--highlight-color) shadow-[0_1px_4px_0_rgb(0_0_0_/_0.2)]',
          answer === LETTER_STATUS_CONTAINS && 'bg-putty-500 border-putty-200',
          answer === LETTER_STATUS_EXACT && 'bg-swamp-green-500 border-swamp-green-200',
          answer === LETTER_STATUS_INCORRECT && 'bg-charade-800 && border-charade-500',
          shareEnabled && 'group-hover:brightness-80',
        ]}
      ></div>
    {/each}
    <div
      class={[
        'hidden',
        shareEnabled &&
          'absolute top-0 right-0 bottom-0 left-0 col-span-5 col-start-1 row-span-6 row-start-1 grid place-items-center group-hover:grid',
      ]}
    >
      <ShareIcon class="text-snow-100 m-auto size-12" />
    </div>
  </div>
</button>
