<script lang="ts">
  import Error from './+error.svelte';
  let { children } = $props();
</script>

<svelte:boundary>
  {@render children()}

  {#snippet failed()}
    <Error />
  {/snippet}
</svelte:boundary>
