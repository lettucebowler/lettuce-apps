<script module lang="ts">
  const backdropFadeDuration = 75;
  const dialogScaleDuration = 500;
</script>

<script lang="ts">
  import { focusTrap } from '$lib/attachments.svelte';
  import type { Snippet } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { onClickOutside, PressedKeys } from 'runed';

  type Props = {
    children?: Snippet;
    class?: string;
    open: boolean;
    title?: string;
    onclose?: () => void;
  };

  let { children, class: className, open = $bindable(false), title = '', onclose = () => {} }: Props = $props();

  let container = $state<HTMLElement>()!;

  function maybeClose() {
    if (open) {
      onclose();
    }
  }

  onClickOutside(
    () => container,
    () => maybeClose(),
  );

  let keys = new PressedKeys();

  keys.onKeys(['escape'], () => maybeClose());
</script>

{#if open}
  <div
    in:fade={{ duration: backdropFadeDuration }}
    out:fade={{ duration: backdropFadeDuration }}
    class={[
      'grid place-content-center',
      'fixed bottom-0 left-0 right-0 top-0 z-[999999999]',
      'backdrop-blur-xs',
      'bg-[radial-gradient(#D4D4D8_1px,transparent_1px)]',
    ]}
  >
    <div
      {@attach focusTrap()}
      bind:this={container}
      in:scale={{ duration: dialogScaleDuration, delay: backdropFadeDuration, start: 0.9 }}
      out:scale={{ duration: dialogScaleDuration, start: 0.9 }}
      class={[
        'relative z-10',
        'w-full max-w-xs sm:w-max sm:min-w-80',
        'text-snow-300 text-left',
        'shadow-md dark:shadow-none',
        'rounded-2xl p-4',
        'bg-charade-900',
        className,
      ]}
    >
      <button
        class="text-snow-300 absolute right-3 top-3 h-8 rounded-sm p-1 hover:outline focus:outline active:outline-2"
        onclick={() => onclose()}
      >
        {@render IconClose()}
      </button>
      {#if title}<p class="text-2xl font-semibold">{title}</p>{/if}
      {@render children?.()}
    </div>
  </div>
{/if}

{#snippet IconClose()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="box-border aspect-square h-full"
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
{/snippet}
