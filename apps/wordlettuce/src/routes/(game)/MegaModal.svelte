<script module lang="ts">
</script>

<script lang="ts">
  import Dialog from '$lib/components/base/Dialog.svelte';
  import { fly } from 'svelte/transition';
  import { createExpiringString, createNewGameCountDownTimer } from './spells.svelte';

  type ModalProps = {
    gameNum: number;
    answers: Array<string>;
    authenticated?: boolean;
    open: boolean;
    onclose: () => void;
  };

  import { appName } from '$lib/app-constants';

  const { gameNum, answers, authenticated, onclose, open }: ModalProps = $props();
  let attempts = $derived(answers.length);
  const clipboardMessage = createExpiringString({ duration: 2000 });
  const timeUntilNextGame = createNewGameCountDownTimer();

  function formatTime(secondsUntil: number) {
    const hours = Math.floor(secondsUntil / 3600);
    const minutes = Math.floor((secondsUntil % 3600) / 60);
    const seconds = secondsUntil % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  function shareGame() {
    if (!navigator?.clipboard) {
      clipboardMessage.write('navigator clipboard api not supported in this browser');
    }

    navigator.clipboard
      .writeText(getGameStatus())
      .then(() => {
        clipboardMessage.write('Copied to clipboard!');
      })
      .catch(() => {
        clipboardMessage.write('Oppsie :(');
      });
  }

  function getGameStatus() {
    const today = `${appName} ${gameNum} ${answers.length}/6`;
    const strings = answers.map((k) => {
      return k
        .split('')
        .map((w) => {
          return getStatusEmoji(w);
        })
        .join('');
    });
    return [today, ...strings].join('\n');
  }

  function getStatusEmoji(status: string) {
    switch (status) {
      case 'x':
        return '🟩';
      case 'c':
        return '🟨';
      case '_':
      case 'i':
      default:
        return '⬛';
    }
  }

  $effect(() => {
    if (open) {
      timeUntilNextGame.start();
    } else {
      timeUntilNextGame.pause();
    }
  });
</script>

<Dialog
  {open}
  title="Success!"
  onclose={() => {
    timeUntilNextGame.pause();
    onclose();
  }}
  class="border-charade-700 space-y-2 border-t-2"
>
  <p class="text-snow-300">
    You solved today's WordLettuce in {attempts} guess{attempts > 1 ? 'es' : ''}. Come back tomorrow and play again!
  </p>
  <p class="text-snow-300 grid place-items-center text-center font-bold">
    Next word in {formatTime(timeUntilNextGame.value)}
  </p>
  <div class="-mx-2 -mb-2 grid gap-2">
    {#if !authenticated}
      <a
        class="bg-antique-brass-500 text-snow-300 border-t-1 border-antique-brass-400 box-border block w-full cursor-pointer rounded-lg p-2 text-center font-bold shadow-sm hover:brightness-90 active:mb-[1px] active:border-none"
        href="/signin">Login to save your results</a
      >
    {/if}
    <button
      onclick={() => shareGame()}
      class="bg-frost-400 text-snow-300 border-t-1 border-frost-300 box-border block w-full cursor-pointer rounded-lg p-2 font-bold shadow-sm hover:brightness-90 active:mb-[1px] active:border-none"
      >{#if clipboardMessage.value}
        <span class="text-snow-300 -z-10 p-2 text-center">{clipboardMessage.value}</span>
      {:else}
        Share
      {/if}</button
    >
  </div>
</Dialog>
