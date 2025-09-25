<script lang="ts">
  import { flip } from 'svelte/animate';
  import Tile from './Tile.svelte';
  import Cookies from 'js-cookie';
  import { createExpiringBoolean } from './spells.svelte';
  import { browser } from '$app/environment';
  import { toastError, toastLoading, toastSuccess } from './toast';
  import { pushState } from '$app/navigation';
  import { page } from '$app/state';
  import ShareIcon from '$lib/components/ShareIcon.svelte';
  import EnterIcon from '$lib/components/EnterIcon.svelte';
  import BackSpaceIcon from '$lib/components/BackSpaceIcon.svelte';
  import { STATE_COOKIE_NAME_V2 } from '$lib/app-constants';
  import { LetterStatus } from '$lib/game-schemas';
  import Key from './Key.svelte';
  import type { PageProps } from './$types';
  import MegaModal from './MegaModal.svelte';
  import { letter, undo, word } from '$lib/game.remote';

  let { data = $bindable() }: PageProps = $props();

  const wordIsInvalid = createExpiringBoolean();
  const duration = 0.15;

  function showModal() {
    pushState('', {
      showModal: true,
    });
  }

  function saveGameStateToCookie() {
    Cookies.set(STATE_COOKIE_NAME_V2, data.game.toStateString(), {
      path: '/',
      httpOnly: false,
      expires: 1,
      secure: false,
    });
  }

  function invalidForm(message = 'Invalid word') {
    wordIsInvalid.truthify();
    toastError(message);
  }

  function getItemsForGrid() {
    const maxPreviousGuesses = data.game.success ? 6 : 5;
    const maxFillerGuesses = 5;

    const previousGuesses = data.game.guesses.map((guess, index) => ({ index, guess })).slice(-1 * maxPreviousGuesses);
    const currentGuesses = data.game.success
      ? []
      : [
          {
            index: data.game.guesses.length,
            guess: data.game.currentGuess,
          },
        ];
    const fillerGuesses = Array(maxFillerGuesses)
      .fill(null)
      .map((_, index) => ({
        index: data.game.guesses.length + (data.game.success ? 0 : 1) + index,
        guess: '',
      }));
    const items = [...previousGuesses, ...currentGuesses, ...fillerGuesses].filter(Boolean).slice(0, 6);
    return items;
  }
</script>

<main class="game-grid grid flex-auto grid-rows-[1fr_160px] gap-2 sm:gap-4">
  <div class="size-container grid w-full">
    <div class="max-w-[min(100%,min(calc((100cqh)/6*5)),720px))] m-auto grid w-full grid-rows-[repeat(6,1fr)] gap-2">
      {#each getItemsForGrid() as item (item.index)}
        {@const current = item.index === data.game.answers.length}
        <div
          class="grid grid-cols-[repeat(5,1fr)] gap-2"
          animate:flip={{ duration: duration * 1000 }}
          data-index={item.index}
        >
          {#each item.guess.padEnd(5, ' ').slice(0, 5).split('') as letter, j}
            {@const doJump = browser && data.game.answers.at(item.index)?.length === 5}
            {@const doWiggle = browser && wordIsInvalid.value && current}
            {@const doWiggleOnce = !browser && !!Object.keys(word.issues ?? {}).length && current}
            <div
              class={[
                'bg-charade-950 z-(--z-index) rounded-xl',
                'aspect-square shadow-[inset_0_var(--tile-height)_var(--tile-height)_0_rgb(0_0_0/0.2),inset_0_calc(-1*var(--tile-height))_0_0_var(--color-charade-800)]',
                !item.guess && current && wordIsInvalid.value && browser && 'animate-wiggle',
                !item.guess && current && !!Object.keys(word.issues ?? {}).length && !browser && 'animate-wiggle-once',
              ]}
            >
              <Tile
                letter={letter === ' ' ? '' : letter}
                answer={data.game.answers.at(item.index)?.charAt(j)}
                column={j}
                {doJump}
                {doWiggle}
                {doWiggleOnce}
              />
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </div>
  <form class="keyboard grid w-full flex-auto gap-1" method="POST">
    <div class="grid flex-auto grid-cols-[repeat(40,0.25fr)] grid-rows-3 gap-1" style="--keyboard-height: 1px;">
      {#each 'q,w,e,r,t,y,u,i,o,p,,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m'.split(',') as l}
        {@const status = data.game.letterStatuses[l]}
        {#if l}
          <Key
            status={status as LetterStatus}
            aria-label={l}
            title={l}
            name={letter.field('key')}
            value={l}
            {...letter.buttonProps.enhance(async (event) => {
              data.game.doLetter(event.data.key);
              saveGameStateToCookie();
            })}
          >
            {l}
          </Key>
        {:else}
          <div></div>
        {/if}
      {/each}
      <Key
        aria-label="enter"
        title="enter"
        value="Enter"
        {...word.buttonProps.enhance(async ({ submit }) => {
          let saveGameToastId: string | undefined = undefined;
          data.game.doSumbit();
          if (data.game.invalid) {
            return invalidForm();
          }
          if (!data.game.success) {
            return saveGameStateToCookie();
          }

          try {
            if (data.user && data.game.success) {
              saveGameToastId = toastLoading('Saving results...');
            }
            await submit();
            if (saveGameToastId) {
              toastSuccess('Game results saved', { id: saveGameToastId });
              setTimeout(() => showModal(), 500);
            }
          } catch (error) {
            if (saveGameToastId) {
              toastError('Failed to save game results', { id: saveGameToastId });
            }
          }
        })}
      >
        <span class="pointer-events-none"><EnterIcon class="mx-auto w-7" /></span>
      </Key>
      <Key
        value="Backspace"
        title="backspace"
        aria-label="backspace"
        {...undo.buttonProps.enhance(async ({}) => {
          data.game.doUndo();
          saveGameStateToCookie();
        })}
      >
        <span class="pointer-events-none"><BackSpaceIcon class="mx-auto w-7" /></span>
      </Key>
      {#if data.game.success && browser}
        <Key aria-label="share" title="share" onclick={() => showModal()}>
          <span class="pointer-events-none"><ShareIcon class="mx-auto w-7" /></span>
        </Key>
      {/if}
    </div>
  </form>
</main>
<MegaModal
  open={!!page.state.showModal}
  onclose={() => history.back()}
  gameNum={data.game.gameNum}
  answers={data.game.answers}
  authenticated={data.authenticated}
/>

<style>
  .size-container {
    container-type: size;
  }

  @media (height > 1000px) {
    .game-grid {
      grid-template-rows: 1fr 240px;
    }
  }
</style>
