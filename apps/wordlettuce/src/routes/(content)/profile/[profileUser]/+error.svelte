<script lang="ts">
  import { page } from '$app/state';
  import { LettuceAvatar } from '@lettuce-apps-packages/svelte-common';
</script>

<main class="space-y-8">
  <figure class="flex flex-col gap-2">
    <div class="text-snow-300 mx-auto h-40 w-40 overflow-hidden rounded-3xl text-3xl">
      <LettuceAvatar name={page.params.profileUser} />
    </div>
    <figcaption class="text-snow-300 text-center text-xl font-medium">
      {page.params.profileUser}
    </figcaption>
  </figure>

  <p class="text-snow-300 text-center text-xl">
    This user was not found, but if we did find them, they'd have a pretty cool auto-generated avatar!
  </p>
</main>
