<script lang="ts">
  import { browser } from '$app/environment';
  import ShareIcon from '$lib/components/ShareIcon.svelte';
  import { getGameStatus } from '$lib/util';
  import { appName } from '$lib/app-constants';
  import { toastError, toastSuccess } from '../../toast';

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
  <div class="@container group relative grid grid-cols-5 gap-1">
    {#each [...Array(30).keys()] as i}
      {@const answer = answers.charAt(i) || '_'}
      <div
        data-answer={answer}
        class={[
          '@min-[170px]:rounded-sm @min-[200px]:rounded @min-[230px]:rounded-lg aspect-square w-full',
          answer === '_'
            ? 'bg-charade-950'
            : 'border-(--highlight-color) border-t-[1px] shadow-[0_1px_4px_0_rgb(0_0_0_/_0.2)]',
          answer === 'c' && 'bg-putty-500 border-putty-200',
          answer === 'x' && 'bg-swamp-green-500 border-swamp-green-200',
          answer === 'i' && 'bg-charade-800 && border-charade-500',
          shareEnabled && 'group-hover:brightness-80',
        ]}
      ></div>
    {/each}
    <div
      class={[
        'hidden',
        shareEnabled &&
          'absolute bottom-0 left-0 right-0 top-0 col-span-5 col-start-1 row-span-6 row-start-1 grid cursor-pointer place-items-center group-hover:grid',
      ]}
    >
      <ShareIcon class="text-snow-100 m-auto size-12" />
    </div>
  </div>
</button>
