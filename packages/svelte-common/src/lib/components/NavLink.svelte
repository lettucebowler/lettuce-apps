<script module lang="ts">
  import { crossfade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  const [send, recieve] = crossfade({
    duration: 250,
    easing: cubicOut,
  });
</script>

<script lang="ts">
  import { page } from '$app/state';
  import type { Snippet } from 'svelte';

  type Props =
    | {
        to: string;
        class?: string;
        label: string;
        children?: undefined;
      }
    | {
        to: string;
        class?: string;
        label?: undefined;
        children: Snippet<[]>;
      };

  let { to, class: className, label, children }: Props = $props();

  let current = $derived(page.url.pathname === to);
</script>

<a
  class={['text-snow-300 grid w-max text-base font-bold hover:underline sm:text-3xl sm:font-medium', className]}
  aria-current={current}
  href={to}
>
  {#if current}
    <div
      in:recieve={{ key: 'current-link' }}
      out:send={{ key: 'current-link' }}
      class="bg-charade-800 border-charade-700 col-start-1 row-start-1 box-border rounded-xl border-t shadow-md"
    ></div>
  {/if}
  <div class={['z-10 col-start-1 row-start-1', label && 'px-4 py-2.5 first-letter:capitalize']}>
    {#if label}
      {label}
    {:else}
      {@render children?.()}
    {/if}
  </div>
</a>
