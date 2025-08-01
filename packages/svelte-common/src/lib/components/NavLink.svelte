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

  interface Props {
    to: string;
    class?: string;
    children: Snippet<[]>;
  }

  let { to, class: className, children }: Props = $props();

  let current = $derived(page.url.pathname === to);
</script>

<!-- <a
  class={[
    'text-snow-300 grid h-full cursor-pointer items-center rounded-xl border-transparent text-3xl font-medium hover:underline',
    className && className,
  ]}
  class:text-snow-100={current}
  class:after:bg-charade-800={current}
  aria-current={current}
  href={to}
>
  <div class="col-start-1 row-start-1 box-border grid h-14 h-full w-full">
    {#if current}
      <div
        in:recieve={{ key: 'current-link' }}
        out:send={{ key: 'current-link' }}
        class="bg-charade-800 border-charade-700 grid h-full rounded-xl border-t shadow-md"
      ></div>
    {/if}
  </div>
  <div class="z-10 col-start-1 row-start-1 h-full">
    {@render children?.()}
  </div>
</a> -->
<a
  class={['text-snow-300 container grid w-max text-3xl font-medium hover:underline', className]}
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
  <div class="z-10 col-start-1 row-start-1 h-full p-2">
    {@render children?.()}
  </div>
</a>
