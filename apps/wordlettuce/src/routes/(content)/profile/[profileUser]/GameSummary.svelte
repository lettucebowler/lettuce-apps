<script lang="ts">
  type GameSummaryProps = {
    answers: string;
    radius?: 'lg' | 'md' | 'sm';
  };
  let { answers, radius = 'lg' }: GameSummaryProps = $props();
</script>

<div class="grid grid-cols-5 gap-1">
  {#each [...Array(30).keys()] as i}
    {@const answer = answers.charAt(i) || '_'}
    <div
      data-answer={answer}
      class={[
        'aspect-square w-full',
        radius === 'lg' && 'rounded-lg',
        radius === 'md' && 'rounded',
        answer === '_'
          ? 'bg-charade-950'
          : 'border-(--highlight-color) border-t-[1px] shadow-[0_1px_4px_0_rgb(0_0_0_/_0.2)]',
        answer === 'c' && 'bg-putty-500 border-putty-200',
        answer === 'x' && 'bg-swamp-green-500 border-swamp-green-200',
        answer === 'i' && 'bg-charade-800 && border-charade-500',
      ]}
    ></div>
  {/each}
</div>
