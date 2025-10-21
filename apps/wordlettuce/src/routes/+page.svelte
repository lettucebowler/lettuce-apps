<script lang="ts">
  import { flip } from 'svelte/animate';
  import Tile from './Tile.svelte';
  import Cookies from 'js-cookie';
  import { browser } from '$app/environment';
  import { toastError, toastLoading, toastSuccess } from './toast';
  import { pushState } from '$app/navigation';
  import { page } from '$app/state';
  import ShareIcon from '$lib/components/icons/ShareIcon.svelte';
  import EnterIcon from '$lib/components/icons/EnterIcon.svelte';
  import BackSpaceIcon from '$lib/components/icons/BackSpaceIcon.svelte';
  import { STATE_COOKIE_NAME_V2 } from '$lib/app-constants';
  import { LetterStatus } from '$lib/game-schemas';
  import Key from './Key.svelte';
  import MegaModal from './MegaModal.svelte';
  import { getGameState, letter, undo, word } from './game.remote';
  import { getSession } from './auth.remote';
  import { WordlettuceGame } from '$lib/wordlettuce-game.svelte';
  import { WordFormInput } from './game.schemas';

  const [game, session] = $derived(await Promise.all([getGameState(), getSession()]));

  $effect(() => {
    if (word.fields.word.issues()) {
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
  });

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
            {@const doWiggleOnce = !browser && word.fields.word.issues() && row.current}
            <div
              style="--animation-delay:{j * 0.03}s;"
              class={[
                'wiggler bg-charade-950 z-(--z-index) rounded-xl',
                'aspect-square shadow-[inset_0_var(--tile-height)_var(--tile-height)_0_rgb(0_0_0/0.2),inset_0_calc(-1*var(--tile-height))_0_0_var(--color-charade-800)]',
                !row.guess && row.current && word.fields.word.issues() && !browser && 'animate-wiggle-once',
                doWiggleOnce && 'animate-wiggle-once',
                row.current && 'current',
              ]}
            >
              <Tile
                --transition-delay="{j * 0.03 + duration}s"
                letter={letter === ' ' ? '' : letter}
                answer={game.answers.at(row.index)?.charAt(j)}
                class={doJump ? 'animate-jump [animation-delay:var(--animation-delay)]' : ''}
              />
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </div>
  <form class="keyboard grid w-full flex-auto gap-1" method="POST">
    <input type="hidden" value={game.currentGuess} name="word" />
    <div class="grid flex-auto grid-cols-[repeat(40,0.25fr)] grid-rows-3 gap-1" style="--keyboard-height: 1px;">
      {#each 'q,w,e,r,t,y,u,i,o,p,,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m'.split(',') as l}
        {@const status = game.letterStatuses[l]}
        {#if l}
          <Key
            status={status as LetterStatus}
            aria-label={l}
            title={l}
            name="key"
            value={l}
            {...letter.buttonProps.enhance(async (event) => {
              game.doLetter(event.data.key);
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
        {...word.preflight(WordFormInput).buttonProps.enhance(async ({ submit, data }) => {
          if (game.success) {
            return;
          }
          const { success } = game.doWord(data.word);
          if (!success) {
            return saveGameStateToCookie();
          }
          let saveGameToastId: string | undefined = undefined;
          try {
            if (session.authenticated && game.success) {
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
        <EnterIcon class="mx-auto w-7" />
      </Key>
      <Key
        value="Backspace"
        title="backspace"
        aria-label="backspace"
        {...undo.buttonProps.enhance(async ({}) => {
          game.doUndo();
          saveGameStateToCookie();
        })}
      >
        <BackSpaceIcon class="mx-auto w-7" />
      </Key>
      {#if game.success && browser}
        <Key aria-label="share" title="share" onclick={() => showModal()} type="button">
          <ShareIcon class="mx-auto w-7" />
        </Key>
        <!-- {:else}
        <button
          type="button"
          onclick={() => {
            getGameState().set(new WordlettuceGame());
          }}>click me!</button
        > -->
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
