<script module lang="ts">
  const backdropFadeDuration = 75;
  const dialogScaleDuration = 500;
</script>

<script lang="ts">
  import { focusTrap } from '$lib/actions/focus-trap.svelte';
  import { escapeKey } from '$lib/attachments.svelte';
  import { outsideClick } from '$lib/actions/outside-click.svelte';
  import type { Snippet } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  type Props = {
    children?: Snippet;
    class?: string;
    open: boolean;
    title?: string;
    onclose?: () => void;
  };

  let { children, class: className, open = $bindable(false), title = '', onclose = () => {} }: Props = $props();
</script>

{#if open}
  <!-- BACKDROP -->
  <div
    in:fade={{ duration: backdropFadeDuration }}
    out:fade={{ duration: backdropFadeDuration }}
    class={[
      'grid place-content-center', // layout
      'fixed bottom-0 left-0 right-0 top-0 z-[999999999]', // position
      'backdrop-blur-xs', // background
      'bg-[radial-gradient(#D4D4D8_1px,transparent_1px)]', // light dots
    ]}
  >
    <!-- DIALOG CONTAINER -->
    <div
      {@attach escapeKey(() => {
        if (open) {
          onclose();
        }
      })}
      use:focusTrap
      use:outsideClick={() => {
        if (open) {
          onclose();
        }
      }}
      in:scale={{ duration: dialogScaleDuration, delay: backdropFadeDuration, start: 0.9 }}
      out:scale={{ duration: dialogScaleDuration, start: 0.9 }}
      class={[
        'relative z-10', // layout and positioning
        'w-full max-w-xs sm:w-max sm:min-w-80', // width
        'text-snow-300 text-left', // background and text
        'shadow-md dark:shadow-none', // shadow
        'rounded-2xl p-4', // border
        'bg-charade-900',
        // STYLING
        className,
      ]}
    >
      <!-- CLOSE BUTTON -->
      <button
        class="text-snow-300 absolute right-3 top-3 h-8 rounded-sm p-1 hover:outline focus:outline active:outline-2"
        onclick={() => onclose()}
      >
        {@render IconClose()}
      </button>

      <!-- HEADER -->
      {#if title}<p class="text-2xl font-semibold">{title}</p>{/if}

      <!-- BODY -->
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
