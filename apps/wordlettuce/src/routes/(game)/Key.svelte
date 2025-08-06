<script lang="ts">
  import type { LetterStatus } from '$lib/game-schemas';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { hotKey } from '$lib/actions/hot-key.svelte';

  type KeyProps = {
    status?: LetterStatus;
  } & HTMLButtonAttributes;

  const { status, children, value, ...rest }: KeyProps = $props();

  let el: HTMLButtonElement;
</script>

<button
  bind:this={el}
  {value}
  {...rest}
  use:hotKey={{
    key: value?.toString() || '',
    onKeydown() {
      console.log('el', el);
      el.click();
    },
  }}
  style="--keyboard-height: 1px; --highlight-color: var({status === 'x'
    ? '--color-swamp-green-200'
    : status === 'c'
      ? '--color-putty-200'
      : '--color-charade-400'})"
  class={[
    'mt-(--keyboard-height) text-(--text-color) col-span-4 grid h-full w-full cursor-pointer place-items-center rounded-md text-center text-sm font-bold  active:shadow-none sm:py-2 md:text-xl',
    status && 'bg-(--bg-color) text-(--text-color)',
    ['x', 'c', undefined].includes(status) &&
      'shadow-[0_var(--keyboard-height)_4px_0_rgb(0_0_0_/_0.2),0_calc(-1*var(--keyboard-height))_0_0_var(--highlight-color)] active:mt-0',
    status === 'x' && 'bg-swamp-green-500 text-swamp-green-900',
    status === 'c' && 'bg-putty-500 text-putty-900',
    status === 'i' && 'bg-charade-800 text-charade-300 shadow-none',
    status === undefined && 'bg-charade-600 text-charade-100',
  ]}
>
  {@render children?.()}
</button>
