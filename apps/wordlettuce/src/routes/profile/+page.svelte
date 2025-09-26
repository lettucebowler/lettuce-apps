<script lang="ts">
  import { page } from '$app/state';
  import { LettuceAvatar } from '@lettuce-apps-packages/svelte-common';
</script>

<main class="space-y-8">
  <figure class="flex flex-col gap-2">
    <div class="text-snow-300 bg-charade-700 mx-auto h-40 w-40 overflow-hidden rounded-3xl text-3xl shadow-lg">
      <LettuceAvatar name={page.params.profileUser ?? ''} />
    </div>
    <figcaption class="text-snow-300 text-center text-xl font-medium">
      {page.params.profileUser}
    </figcaption>
  </figure>
  <h1 class="text-snow-300 text-center text-3xl font-bold">Oh no!</h1>
  <p class="text-snow-300 text-center text-xl">
    If you were trying to look at someone's profile, you have found the wrong place. <a
      class="text-swamp-green-500"
      href="/signin">Sign in</a
    > to view your own profile.
  </p>
</main>
