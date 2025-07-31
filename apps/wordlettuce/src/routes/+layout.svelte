<script lang="ts">
  import smallFavicon from '$lib/assets/favicon-16x16.png';
  import bigFavicon from '$lib/assets/favicon-32x32.png';
  import appleTouchIcon from '$lib/assets/apple-touch-icon.png';
  import safariPinnedTabIcon from '$lib/assets/safari-pinned-tab.svg';
  import { appName } from '$lib/app-constants';
  import { PageContentContainer } from '@lettuce-apps-packages/svelte-common';
  import AuthNav from './AuthNav.svelte';
  import '../app.css';
  let { data, children } = $props();
</script>

<svelte:head>
  <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
  <link rel="icon" type="image/png" sizes="32x32" href={bigFavicon} />
  <link rel="icon" type="image/png" sizes="16x16" href={smallFavicon} />
  <link rel="mask-icon" href={safariPinnedTabIcon} color="#a3be8c" />
  <meta name="description" content="Lettuce Wordle`" />
  <title>{appName}</title>
</svelte:head>

<PageContentContainer --tile-height="2px">
  <div class="flex h-full min-h-[100dvh] flex-col gap-2 p-2 sm:gap-4 sm:p-4" data-sveltekit-preload-data="hover">
    <AuthNav links={data.nav} user={data.authenticated ? data.user.username : undefined} />
    {@render children()}
  </div>
</PageContentContainer>
