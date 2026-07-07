<script lang="ts">
  import { PageContentContainer } from '@lettuce-apps-packages/svelte-common';
  import { NavBar, NavLink } from '@lettuce-apps-packages/svelte-common';
  import '../app.css';
  import { sessionQuery } from './auth.remote';
  import { Toasts } from 'svoast';
  import favicon from '$lib/assets/favicon.svg';
  import { appName } from '$lib/app-constants';
  import { page } from '$app/state';

  let { children } = $props();
  let session = $derived(await sessionQuery());

  let isOnOwnProfilePage = $derived(
    session.authenticated ? page.url.pathname === `/profile/${session.user.username}` : false,
  );
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <meta name="title" content={appName} />
</svelte:head>

<PageContentContainer --tile-height="2px">
  <div class="flex h-full min-h-dvh flex-col gap-2 p-2 sm:gap-4 text-sm sm:px-4" data-sveltekit-preload-data="hover">
    <div class="flex justify-between bg-charade-950 rounded-lg text-charade-50">
      <NavBar>
        <NavLink to="/" class="hover:underline">Home</NavLink>
        <NavLink to="/rankings" class="hover:underline">Rankings</NavLink>
        <NavLink to="/about" class="hover:underline">About</NavLink>
      </NavBar>
      {#if session.authenticated}
        <a
          href="/profile/{session.user.username}"
          class={[
            'flex items-stretch aspect-square block ml-auto hover:p-2 transition-all duration-150',
            isOnOwnProfilePage ? 'p-2' : 'p-3',
          ]}
        >
          <img
            src="https://api.dicebear.com/9.x/bottts-neutral/svg?backgroundColor=BF616A&backgroundColor=D08770&backgroundColor=EBCB8B&backgroundColor=A3BE8C&backgroundColor=B48EAD&backgroundColor=88C0D0&backgroundType=gradientLinear&seed={session
              .user.username}"
            alt="{session.user.username} avatar"
            class="rounded"
          />
        </a>
      {:else}
        <a href="/signin" class="ml-auto text-charade-50 text-2xl font-bold pr-4 pt-3 hover:underline">Sign in</a>
      {/if}
    </div>
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
