<script lang="ts">
  import type { LetterStatus } from '$lib/game-schemas';
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { hotKey } from '$lib/actions/hot-key.svelte';

  type KeyProps = {
    status?: LetterStatus;
    children?: Snippet;
  } & HTMLButtonAttributes;

  const { status, children, ...rest }: KeyProps = $props();

  let el: HTMLButtonElement;
</script>

<button
  bind:this={el}
  use:hotKey={{
    key: rest.value?.toString() || '',
    onKeydown() {
      el.click();
    },
  }}
  data-status={status}
  {...rest}
  class={[
    'mt-(--keyboard-height) bg-(--bg-color) text-(--text-color) col-span-4 grid h-full w-full cursor-pointer place-items-center rounded-md text-center text-sm font-bold  active:shadow-none sm:py-2 md:text-xl',
    status && 'bg-(--bg-color) text-(--text-color)',
    ['x', 'c', undefined].includes(status) &&
      'shadow-[0_var(--keyboard-height)_4px_0_rgb(0_0_0_/_0.2),0_calc(-1*var(--keyboard-height))_0_0_var(--highlight-color)] active:mt-0',
  ]}
>
  {@render children?.()}
</button>

<style>
  [data-status='x'] {
    --bg-color: var(--color-swamp-green-500);
    --text-color: var(--color-swamp-green-900);
    --highlight-color: var(--color-swamp-green-200);
  }

  [data-status='c'] {
    --bg-color: var(--color-putty-500);
    --text-color: var(--color-putty-900);
    --highlight-color: var(--color-putty-200);
  }

  [data-status='i'] {
    --bg-color: var(--color-charade-800);
    --text-color: var(--color-charade-300);
  }

  button {
    --highlight-color: var(--color-charade-400);
    --bg-color: var(--charade-600);
    --text-color: var(--color-charade-100);
  }
</style>
