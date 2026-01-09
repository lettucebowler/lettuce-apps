<script lang="ts">
  import { getProjects } from '$lib/remote/projects.remote';
  import ExternalLinkIcon from './ExternalLinkIcon.svelte';

  const projects = $derived(await getProjects());
</script>

<svelte:head>
  <title>Projects | Grant Montgomery</title>
</svelte:head>
<main class="container mx-auto flex flex-col gap-6">
  <h1 class="text-3xl font-bold">Projects</h1>
  {#each projects as project}
    <div class="space-y-1">
      {#if project.url}
        <a href={project.url} target="_blank" class="text-swamp-green-500 hover:underline">
          <h2 class="mb-2 text-2xl font-bold">
            {project.title}
            <ExternalLinkIcon class="mb-3 -ml-1 inline-block size-3" />
          </h2>
        </a>
      {:else}
        <h2 class="text-2xl font-bold text-antique-brass-500">
          {project.title}
        </h2>
      {/if}
      <p>{project.summary}</p>
      <dl class="flex">
        <dt>status:</dt>
        &nbsp;
        <dd class="font-medium">{project.status}</dd>
      </dl>
      {#each project.description as paragraph}
        <p>{paragraph}</p>
      {/each}
    </div>
  {/each}
</main>
