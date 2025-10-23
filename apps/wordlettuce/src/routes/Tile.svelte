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
    'h-full rounded-xl pt-(--tile-height) capitalize transition delay-(--transition-delay)',
    status === 'CONTAINS' && 'bg-putty-300',
    status === 'EXACT' && 'bg-swamp-green-300',
    status === 'INCORRECT' && 'bg-charade-500',
    className,
  ]}
>
  <div
    class={[
      'grid h-full w-full items-center rounded-xl text-center text-2xl font-bold transition-all delay-(--transition-delay) duration-0 sm:text-3xl',
      status === 'EXACT' && 'bg-swamp-green-500 text-swamp-green-800',
      status === 'CONTAINS' && 'bg-putty-500 text-putty-800',
      status === 'INCORRECT' && 'bg-charade-700 text-charade-100',
      'bg-(--tile-color)',
      status === 'NONE' && 'text-charade-100',
      status !== 'NONE' && 'shadow-[0_var(--tile-height)_4px_0_rgb(0_0_0_/_0.2)]',
    ]}
  >
    {@render children?.()}
  </div>
</div>
