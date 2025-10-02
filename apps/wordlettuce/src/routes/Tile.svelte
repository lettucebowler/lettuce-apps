<script lang="ts">
  type TileProps = {
    letter: string;
    answer: string | undefined;
    column?: number;
  };

  let { letter = '', answer, column = 0 }: TileProps = $props();

  const delayScale = 0.03;
  const duration = delayScale * 5;
</script>

<div
  style="--animation-delay:{column * 0.03}s; --transition-delay:{column * delayScale + duration}s"
  class={[
    'pt-(--tile-height) delay-(--transition-delay) h-full rounded-xl transition',
    answer === 'c' && 'bg-putty-300',
    answer === 'x' && 'bg-swamp-green-300',
    answer === 'i' && 'bg-charade-500',
  ]}
>
  <div
    class={[
      'text-charade-100 delay-(--transition-delay) grid h-full w-full items-center rounded-xl text-center text-2xl font-bold transition-all duration-0 sm:text-3xl',
      answer === 'x' && 'bg-swamp-green-500 text-swamp-green-800',
      answer === 'c' && 'bg-putty-500 text-putty-800',
      answer === 'i' && 'bg-charade-700',
      answer && 'shadow-[0_var(--tile-height)_4px_0_rgb(0_0_0_/_0.2)]',
    ]}
  >
    {letter.toUpperCase()}
  </div>
</div>
