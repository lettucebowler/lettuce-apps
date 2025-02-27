<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { LettuceAvatar } from '@lettuce-apps-packages/svelte-common';
  import NavLink from './NavLink.svelte';
  import { navigationSend, navigationRecieve } from './transitions';

  import type { NavLinkProps } from '$lib/types';
  import { page } from '$app/state';

  let { user, links }: { user: string | undefined; links: NavLinkProps[] } = $props();

  let dropdownVisible = $state(false);

  afterNavigate(() => {
    if (dropdownVisible) dropdownVisible = false;
  });
</script>

<div class="w-full">
  <div id="big-papa-nav" class="flex justify-end">
    <nav
      class="border-t-charade-500 h-18 z-10 ml-0 ml-auto box-content max-h-[72px] w-full justify-end gap-x-4"
      id="primary-nav"
    >
      <div class="flex">
        <div class="hidden gap-4 sm:flex">
          {#each links.filter((link) => link.enabled) as link}
            <NavLink {link} />
          {/each}
        </div>
        <div class="ml-auto h-14">
          <div class="flex h-full flex-col sm:hidden">
            <label
              for="subnav-toggle-small"
              class="text-snow-100 hover:bg-charade-800 active:bg-charade-900 box-border flex h-full flex-[0_0_auto] cursor-pointer select-none items-center justify-center gap-2 rounded-xl text-center text-3xl transition ease-in-out sm:hidden"
            >
              <span
                class="border-snow-300 box-border aspect-square h-full overflow-hidden rounded-xl transition-transform"
                class:rotate-180={dropdownVisible}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="aspect-square h-full w-full"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </span>
            </label>
          </div>
          <div class="hidden h-full sm:block">
            {#if user}
              <div class="grid h-14 w-14">
                <div class="col-[1] row-[1] h-14">
                  {#if user && page.url.pathname === '/profile/' + user}
                    <div
                      in:navigationRecieve={{ key: 'current-link' }}
                      out:navigationSend={{ key: 'current-link' }}
                      class="bg-charade-800 border-charade-600 grid h-14 rounded-2xl border-t shadow-md"
                    ></div>
                  {/if}
                </div>
                <a
                  class="border-snow-300 z-10 col-[1] row-[1] m-1 box-border grid aspect-square overflow-hidden rounded-xl transition transition-all duration-150 hover:m-0"
                  href="/profile/{user}"
                >
                  <LettuceAvatar name={user} />
                </a>
              </div>
            {:else}
              <a
                class="text-snow-100 block grid h-full h-full items-center rounded-xl px-6 py-2 text-center text-3xl font-medium capitalize hover:underline"
                href="/signin">Sign in</a
              >
            {/if}
          </div>
        </div>
      </div>
      <div id="mobile-nav" class="sm:hidden">
        <input
          type="checkbox"
          class="peer hidden"
          name="subnav"
          id="subnav-toggle-small"
          bind:checked={dropdownVisible}
        />
        <nav
          id="subnav-content"
          class="bg-charade-900 divide-charade-600 absolute bottom-0 left-0 right-0 top-[72px] z-10 hidden flex-col divide-y peer-checked:block"
          class:hidden={!dropdownVisible}
        >
          <div class="space-y-4 p-4">
            {#each links.filter((link) => link.enabled) as link}
              <NavLink {link} enableTransition={false} />
            {/each}
          </div>
          <div class="border-charade-800 flex flex-col gap-2 p-4">
            {#if user}
              <div class="mb-2 flex items-center justify-start gap-4">
                <span class="box-border h-[44px] w-[44px] w-max overflow-hidden rounded-sm"
                  ><LettuceAvatar name={user} /></span
                >
                <span class="text-snow-300 text-xl font-medium">{user}</span>
              </div>
              <a href="/profile/{user}" class="text-snow-300 cursor-pointer p-0 text-xl font-medium hover:underline"
                >Profile</a
              >
            {/if}
            <a class="text-snow-300 text-xl font-medium hover:underline" href={user ? '/signout' : '/signin'}
              >{user ? 'Sign out' : 'Sign in'}</a
            >
          </div>
        </nav>
      </div>
    </nav>
  </div>
</div>
