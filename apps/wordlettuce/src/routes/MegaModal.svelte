<script module lang="ts">
</script>

<script lang="ts">
  import Dialog from '$lib/components/base/Dialog.svelte';
  import { ExpiringString, NewGameCountdownTimer } from './spells.svelte';
  import ArrowRightEndOnBoxIcon from '$lib/components/icons/ArrowRightEndOnRectangleIcon.svelte';

  type ModalProps = {
    gameNum: number;
    authenticated?: boolean;
    open: boolean;
    onclose: () => void;
    content: string;
    attempts: number;
  };

  const { gameNum, authenticated, onclose, open, content, attempts }: ModalProps = $props();
  const clipboardMessage = new ExpiringString({ duration: 2000 });
  const timeUntilNextGame = new NewGameCountdownTimer();

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
      .writeText(content)
      .then(() => {
        clipboardMessage.write('Copied to clipboard!');
      })
      .catch(() => {
        clipboardMessage.write('Oppsie :(');
      });
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
    You solved WordLettuce #{gameNum} in {attempts} guess{attempts > 1 ? 'es' : ''}. Come back tomorrow and play again!
  </p>
  <p class="text-snow-300 grid place-items-center text-center font-bold">
    Next word in {formatTime(timeUntilNextGame.value)}
  </p>
  <div class="-mx-2 -mb-2 grid gap-2">
    {#if !authenticated}
      <a
        class="bg-antique-brass-500 text-snow-300 border-antique-brass-400 box-border block w-full rounded-lg border-t-1 p-2 text-center font-bold shadow-sm hover:brightness-90 active:mb-[1px] active:border-none"
        href="/signin">Login to save your results <ArrowRightEndOnBoxIcon class="inline w-6" /></a
      >
    {/if}
    <button
      onclick={() => shareGame()}
      class="bg-frost-400 text-snow-300 border-frost-300 box-border block w-full rounded-lg border-t-1 p-2 font-bold shadow-sm hover:brightness-90 active:mb-[1px] active:border-none"
      >{#if clipboardMessage.value}
        <span class="text-snow-300 -z-10 p-2 text-center">{clipboardMessage.value}</span>
      {:else}
        Share
      {/if}</button
    >
  </div>
</Dialog>
