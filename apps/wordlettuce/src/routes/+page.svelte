<script lang="ts">
  import { flip } from 'svelte/animate';
  import Tile from './Tile.svelte';
  import Cookies from 'js-cookie';
  import { browser } from '$app/environment';
  import { toastError, toastPromise, toastSuccess } from './toast';
  import { pushState } from '$app/navigation';
  import { page } from '$app/state';
  import ShareIcon from '$lib/components/icons/ShareIcon.svelte';
  import EnterIcon from '$lib/components/icons/EnterIcon.svelte';
  import BackSpaceIcon from '$lib/components/icons/BackSpaceIcon.svelte';
  import { STATE_COOKIE_NAME_V2 } from '$lib/app-constants';
  import {
    GuessLetter,
    LETTER_STATUS_CONTAINS,
    LETTER_STATUS_EXACT,
    LETTER_STATUS_INCORRECT,
    LETTER_STATUS_NONE,
  } from '$lib/game-schemas';
  import MegaModal from './MegaModal.svelte';
  import { getGameState, action } from './game.remote';
  import { getSession } from './auth.remote';
  import { WordlettuceGame } from '$lib/wordlettuce-game.svelte';
  import { AllowedGuess } from './game.schemas';
  import { isHttpError } from '@sveltejs/kit';
  const session = await getSession();
  const gameState = $derived(await getGameState());
  let game = $derived(new WordlettuceGame(gameState));
  import * as v from 'valibot';

  function createGameActionKeyID(l: string) {
    return `wordlettuce-game-action-key-${l}`;
  }

  function badWord() {
    toastError('Invalid word');
    if (timeout) {
      clearTimeout(timeout);
    }
    if (tileGridEl) {
      const rows = tileGridEl.querySelectorAll('.wiggler.current');
      rows.forEach((row) => row.classList.add('animate-wiggle'));
      timeout = setTimeout(() => {
        rows.forEach((row) => row.classList.remove('animate-wiggle'));
      }, 150);
    }
  }

  function saveGameStateToCookie() {
    Cookies.set(STATE_COOKIE_NAME_V2, game.encoded, {
      path: '/',
      httpOnly: false,
      expires: 1,
      secure: false,
    });
  }

  const duration = 0.15;

  function showModal() {
    pushState('', {
      showModal: true,
    });
  }

  function getItemsForGrid(game: WordlettuceGame) {
    const maxPreviousGuesses = game.success ? 6 : 5;
    const maxFillerGuesses = 5;
    const previousGuesses = game.guesses
      .map((guess, index) => ({ index, guess, current: false }))
      .slice(-1 * maxPreviousGuesses);
    const currentGuesses = game.success
      ? []
      : [
          {
            index: game.guesses.length,
            guess: game.currentGuess,
            current: true,
          },
        ];
    const fillerGuesses = Array(maxFillerGuesses)
      .fill(null)
      .map((_, index) => ({
        index: game.guesses.length + (game.success ? 0 : 1) + index,
        guess: '',
        current: false,
      }));
    const items = [...previousGuesses, ...currentGuesses, ...fillerGuesses].filter(Boolean).slice(0, 6);
    return items;
  }

  let tileGridEl: HTMLDivElement | null = $state(null);
  let timeout: NodeJS.Timeout;
</script>

<svelte:body
  onkeydown={(e) => {
    const key = e.key.toLowerCase();
    if (key === 'backspace' || key === 'enter' || v.safeParse(GuessLetter, key).success) {
      const el = document.querySelector(`#${createGameActionKeyID(key)}`);
      if (!el) {
        return;
      }
      if (el instanceof HTMLButtonElement) {
        el.click();
      }
    }
  }}
/>
<main class="game-grid grid flex-auto grid-rows-[1fr_160px] gap-2 sm:gap-4">
  <div class="size-container grid w-full">
    <div
      bind:this={tileGridEl}
      class="m-auto grid w-full max-w-[min(100%,min(calc((100cqh)/6*5)),720px))] grid-rows-[repeat(6,1fr)] gap-2"
    >
      {#each getItemsForGrid(game) as row (row.index)}
        <div
          class="grid grid-cols-[repeat(5,1fr)] gap-2"
          animate:flip={{ duration: duration * 1000 }}
          data-index={row.index}
        >
          {#each row.guess.padEnd(5, ' ').slice(0, 5).split('') as letter, j}
            {@const doJump = browser && game.answers.at(row.index)?.length === 5}
            {@const doWiggleOnce = !browser && action.fields.word.issues() && row.current}
            {@const answer = game.answers.at(row.index)?.charAt(j)}
            <div
              style="--animation-delay:{j * 0.03}s;"
              class={[
                'wiggler bg-charade-950 z-(--z-index) rounded-xl',
                'aspect-square shadow-[inset_0_var(--tile-height)_var(--tile-height)_0_rgb(0_0_0/0.2),inset_0_calc(-1*var(--tile-height))_0_0_var(--color-charade-800)]',
                !row.guess && row.current && action.fields.word.issues() && !browser && 'animate-wiggle-once',
                doWiggleOnce && 'animate-wiggle-once',
                row.current && 'current',
              ]}
            >
              <Tile
                --transition-delay="{j * 0.03 + 0.15}s"
                status={answer === LETTER_STATUS_EXACT
                  ? 'EXACT'
                  : answer === LETTER_STATUS_CONTAINS
                    ? 'CONTAINS'
                    : answer === LETTER_STATUS_INCORRECT
                      ? 'INCORRECT'
                      : 'NONE'}
                class={doJump ? 'animate-jump [animation-delay:var(--animation-delay)]' : ''}
              >
                {letter}
              </Tile>
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </div>
  <form
    class="keyboard grid w-full flex-auto gap-1"
    {...action.enhance(async ({ data, submit }) => {
      if (data.letter) {
        game.doLetter(data.letter);
        return saveGameStateToCookie();
      } else if (data.undo) {
        game.doUndo();
        return saveGameStateToCookie();
      } else if (data.word) {
        if (game.success) {
          return;
        }
        const parseResult = v.safeParse(AllowedGuess, data.word);
        if (!parseResult.success) {
          return badWord();
        }
        const { success } = game.doWord(data.word);
        if (!success) {
          return saveGameStateToCookie();
        }
        const promise = submit();
        toastPromise({
          promise,
          loadingText: 'Saving results...',
          successText: 'Results saved!',
          errorText: 'Error saving results',
        });
        await promise;
        setTimeout(() => showModal(), 500);
      }
    })}
  >
    <div class="grid flex-auto grid-cols-[repeat(40,0.25fr)] grid-rows-3 gap-1" style="--keyboard-height: 1px;">
      {#each 'q,w,e,r,t,y,u,i,o,p,,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m'.split(',') as GuessLetter[] as l}
        {#if l}
          <button
            id={createGameActionKeyID(l)}
            {...action.fields.letter.as('submit', l)}
            style="--keyboard-height: 1px; --highlight-color: var({game.letterStatus(l) === LETTER_STATUS_EXACT
              ? '--color-swamp-green-200'
              : game.letterStatus(l) === LETTER_STATUS_CONTAINS
                ? '--color-putty-200'
                : '--color-charade-400'})"
            class={[
              'col-span-4 mt-(--keyboard-height) grid place-items-center rounded-md text-center text-sm font-bold text-(--text-color) capitalize hover:brightness-90 active:shadow-none sm:text-xl md:text-2xl',
              game.letterStatus(l) && 'bg-(--bg-color) text-(--text-color)',
              [LETTER_STATUS_EXACT, LETTER_STATUS_CONTAINS, LETTER_STATUS_NONE].includes(game.letterStatus(l)) &&
                'shadow-[0_var(--keyboard-height)_4px_0_rgb(0_0_0_/_0.2),0_calc(-1*var(--keyboard-height))_0_0_var(--highlight-color)] active:mt-0',
              game.letterStatus(l) === LETTER_STATUS_EXACT && 'bg-swamp-green-500 text-swamp-green-900',
              game.letterStatus(l) === LETTER_STATUS_CONTAINS && 'bg-putty-500 text-putty-900',
              game.letterStatus(l) === LETTER_STATUS_INCORRECT && 'bg-charade-800 text-charade-300 shadow-none',
              game.letterStatus(l) === LETTER_STATUS_NONE && 'bg-charade-600 text-charade-100',
            ]}>{l}</button
          >
        {:else}
          <div></div>
        {/if}
      {/each}
      <button
        id={createGameActionKeyID('enter')}
        aria-label="enter"
        title="enter"
        style="--keyboard-height: 1px; --highlight-color: var(--color-charade-400)"
        class="bg-charade-600 text-charade-100 col-span-4 mt-(--keyboard-height) grid place-items-center rounded-md text-center text-sm font-bold text-(--text-color) capitalize shadow-[0_var(--keyboard-height)_4px_0_rgb(0_0_0_/_0.2),0_calc(-1*var(--keyboard-height))_0_0_var(--highlight-color)] hover:brightness-90 active:mt-0 active:shadow-none sm:text-xl md:text-2xl"
        {...action.fields.word.as('submit', game.currentGuess ? game.currentGuess : 'asdfg')}
      >
        <EnterIcon class="mx-auto w-7" />
      </button>
      <button
        id={createGameActionKeyID('backspace')}
        title="backspace"
        aria-label="backspace"
        style="--keyboard-height: 1px; --highlight-color: var(--color-charade-400)"
        class="bg-charade-600 text-charade-100 col-span-4 mt-(--keyboard-height) grid place-items-center rounded-md text-center text-sm font-bold text-(--text-color) capitalize shadow-[0_var(--keyboard-height)_4px_0_rgb(0_0_0_/_0.2),0_calc(-1*var(--keyboard-height))_0_0_var(--highlight-color)] hover:brightness-90 active:mt-0 active:shadow-none sm:text-xl md:text-2xl"
        {...action.fields.undo.as('submit', 'undo')}
      >
        <BackSpaceIcon class="mx-auto w-7" />
      </button>
      {#if game.success}
        <button
          title="share"
          aria-label="share"
          type="button"
          onclick={() => showModal()}
          style="--keyboard-height: 1px; --highlight-color: var(--color-charade-400)"
          class="bg-charade-600 text-charade-100 col-span-4 mt-(--keyboard-height) grid place-items-center rounded-md text-center text-sm font-bold text-(--text-color) capitalize shadow-[0_var(--keyboard-height)_4px_0_rgb(0_0_0_/_0.2),0_calc(-1*var(--keyboard-height))_0_0_var(--highlight-color)] hover:brightness-90 active:mt-0 active:shadow-none sm:text-xl md:text-2xl"
        >
          <ShareIcon class="mx-auto w-7" />
        </button>
      {/if}
    </div>
  </form>
</main>

<MegaModal
  open={!!page.state.showModal}
  onclose={() => history.back()}
  gameNum={game.gameNum}
  answers={game.answers}
  authenticated={session.authenticated}
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
