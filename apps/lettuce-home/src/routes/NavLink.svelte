<script module lang="ts">
  import { crossfade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  const [send, recieve] = crossfade({
    duration: 250,
    easing: cubicOut
  });
</script>

<script lang="ts">
  import { page } from '$app/state';
  import type { Snippet } from 'svelte';

  type Props =
    | {
        to: string;
        class?: string;
        children?: undefined;
      }
    | {
        to: string;
        class?: string;
        children: Snippet<[]>;
      };

  let { to, class: className, children }: Props = $props();

  let current = $derived(page.url.pathname === to);
</script>

<a class={[className]} aria-current={current} href={to}>
  {@render children?.()}
  <div class="h-1">
    {#if current}
      <div
        class="border-box h-1 bg-charade-700"
        in:recieve={{ key: 'current-link' }}
        out:send={{ key: 'current-link' }}
      ></div>
    {/if}
  </div>
</a>
