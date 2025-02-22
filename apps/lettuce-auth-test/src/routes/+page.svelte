<script lang="ts">
  import type { PageProps } from './$types';

  import { LettuceAvatar } from '@lettuce-apps-packages/svelte-common';

  const { data }: PageProps = $props();
</script>

{#if data.authenticated}
  <p>hello {data.user.username}</p>
  <div class="h-32 w-32">
    <LettuceAvatar name={data.user.username} />
  </div>
{:else}
  <p>Hey stranger</p>
  <a href={data.loginUrl}>login</a>
{/if}
