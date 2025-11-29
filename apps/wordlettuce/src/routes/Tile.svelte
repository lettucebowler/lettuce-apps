<script lang="ts">
  import {
    LETTER_STATUS_CONTAINS,
    LETTER_STATUS_EXACT,
    LETTER_STATUS_INCORRECT,
    LETTER_STATUS_NONE,
    type LetterStatus,
  } from '$lib/game-schemas';
  import type { Snippet } from 'svelte';

  type TileProps = {
    class?: string;
    status: LetterStatus;
    children?: Snippet;
  };

  let { status, class: className, children }: TileProps = $props();
</script>

<div
  data-status={status}
  class={[
    'grid h-full w-full items-center rounded-xl text-center text-2xl font-bold capitalize transition-all delay-(--transition-delay) duration-0 sm:text-3xl',
    status === LETTER_STATUS_EXACT &&
      'bg-swamp-green-500 text-swamp-green-800 border-swamp-green-300 border-t-(length:--tile-height)',
    status === LETTER_STATUS_CONTAINS && 'bg-putty-500 text-putty-800 border-putty-300 border-t-(length:--tile-height)',
    status === LETTER_STATUS_INCORRECT &&
      'bg-charade-700 text-charade-100 border-charade-500 border-t-(length:--tile-height)',
    status === LETTER_STATUS_NONE && 'text-charade-100',
    status !== LETTER_STATUS_NONE && 'shadow-[0_var(--tile-height)_4px_0_rgb(0_0_0/0.2)]',
    className,
  ]}
>
  {@render children?.()}
</div>
