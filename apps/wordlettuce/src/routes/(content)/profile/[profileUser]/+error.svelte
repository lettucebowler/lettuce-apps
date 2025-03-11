<script lang="ts">
  import { page } from '$app/state';
  import { LettuceAvatar } from '@lettuce-apps-packages/svelte-common';
  let b = $state(null);
</script>

<main class="space-y-8">
  <figure class="flex flex-col gap-2">
    <div class="mx-auto h-40 w-40">
      <LettuceAvatar name={page.params.profileUser} size="lg" />
    </div>
    <figcaption class="text-snow-300 text-center text-xl font-medium">
      {page.params.profileUser}
    </figcaption>
  </figure>

  <p class="text-snow-300 text-center text-xl">
    This user was not found, but if they did exist, they'd have a pretty cool auto-generated avatar!
  </p>
</main>
