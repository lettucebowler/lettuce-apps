<script lang="ts">
  import { getProjectsDesc } from '$lib/collections';
  import Project from '$lib/components/Project.svelte';
  import ExternalLinkIcon from '../../lib/components/ExternalLinkIcon.svelte';

  const projects = getProjectsDesc();
</script>

<svelte:head>
  <title>Projects | Grant Montgomery</title>
</svelte:head>
<main class="container mx-auto space-y-8">
  <h1 class="text-3xl font-bold">Projects</h1>
  {#each projects as project}
    <Project {...project} />
  {/each}
</main>
