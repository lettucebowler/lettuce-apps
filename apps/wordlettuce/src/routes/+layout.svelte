<script lang="ts">
  import { LettuceAvatar, PageContentContainer } from '@lettuce-apps-packages/svelte-common';
  import { NavBar, NavLink } from '@lettuce-apps-packages/svelte-common';
  import '../app.css';
  import { getSession } from './auth.remote';
  import { Toasts } from 'svoast';
  import favicon from '$lib/assets/favicon.svg';
  import { page } from '$app/state';
  import { getGameNum } from '$lib/words';
  import { appName } from '$lib/app-constants';

  let { children } = $props();
  const session = $derived(await getSession());
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>{page.data['title'] ?? `${appName}`}</title>
  <meta name="title" content={page.data['metaTitle'] ?? page.data['title'] ?? appName} />
</svelte:head>

<PageContentContainer --tile-height="2px">
  <div class="flex h-full min-h-dvh flex-col gap-2 p-2 sm:gap-4 sm:p-4" data-sveltekit-preload-data="hover">
    <NavBar>
      <NavLink to="/" label="home" />
      <NavLink to="/rankings" label="rankings" />
      <NavLink to="/about" label="about" />
      {#if session.authenticated}
        <NavLink to="/profile/{session.user.username}" class="ml-auto">
          <div
            class="grid aspect-square size-8 h-full place-items-center p-1 transition-all duration-150 hover:p-0 sm:size-14"
          >
            <div class="aspect-square w-full overflow-hidden rounded sm:rounded-lg">
              <LettuceAvatar name={session.user.username} />
            </div>
          </div>
        </NavLink>
      {:else}
        <NavLink to="/signin" class="ml-auto" label="sign in" />
      {/if}
    </NavBar>
    {@render children()}
  </div>
</PageContentContainer>
<Toasts position="top-center" />

<style>
  :root {
    --svoast-bg: var(--color-charade-800);
    --svoast-text: var(--color-snow-300);
    --svoast-padding: 1rem;
    --svoast-font-size: 16px;
    --svoast-radius: 0.5rem;
    --svoast-bar-width: 0.5rem;
    --svoast-error-colour: var(--color-contessa-500);
    --svoast-success-colour: var(--color-swamp-green-500);
  }
</style>
