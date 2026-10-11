<script lang="ts">
  import { getProjectsDesc } from '#lib/collections.remote.js';
  import Project from '#lib/components/Project.svelte';

  const projects = await getProjectsDesc();
</script>

<svelte:head>
  <title>Projects | Grant Montgomery</title>
</svelte:head>
<main class="container max-w-3xl space-y-8">
  <h1 class="text-3xl font-bold">Projects</h1>
  {#each projects as project}
    <Project {...project} />
  {/each}
</main>
