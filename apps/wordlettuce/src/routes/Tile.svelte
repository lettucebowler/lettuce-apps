<script lang="ts">
  import type { Snippet } from 'svelte';

  type TileProps = {
    class?: string;
    status: 'EXACT' | 'CONTAINS' | 'INCORRECT' | 'NONE';
    children?: Snippet;
  };

  let { status, class: className, children }: TileProps = $props();
</script>

<div
  class={[
    'grid h-full w-full items-center rounded-xl text-center text-2xl font-bold capitalize transition-all delay-(--transition-delay) duration-0 sm:text-3xl',
    status === 'EXACT' &&
      'bg-swamp-green-500 text-swamp-green-800 border-swamp-green-300 border-t-(length:--tile-height)',
    status === 'CONTAINS' && 'bg-putty-500 text-putty-800 border-putty-300 border-t-(length:--tile-height)',
    status === 'INCORRECT' && 'bg-charade-700 text-charade-100 border-charade-500 border-t-(length:--tile-height)',
    status === 'NONE' && 'text-charade-100',
    status !== 'NONE' && 'shadow-[0_var(--tile-height)_4px_0_rgb(0_0_0/0.2)]',
    className,
  ]}
>
  {@render children?.()}
</div>
