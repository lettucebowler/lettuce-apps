<script lang="ts">
  import Book from '$lib/components/Book.svelte';
  import Movie from '$lib/components/Movie.svelte';
  import { getLatestMovie } from '$lib/remote/movie-log.remote';
  import { getActiveProjects } from '$lib/remote/projects.remote';
  import { getCurrentBooks, getLastReadBook } from '$lib/remote/reading-log.remote';
  import GithubIcon from './GithubIcon.svelte';
  import ResumeIcon from './ResumeIcon.svelte';
  import TwitterIcon from './TwitterIcon.svelte';

  const latestBook = $derived(await getLastReadBook());
  const activeProjects = $derived(await getActiveProjects());
  const latestMovie = $derived(await getLatestMovie());
  const currentBooks = $derived(await getCurrentBooks());
</script>

<svelte:head>
  <title>Grant Montgomery</title>
</svelte:head>
<main class="mx-auto w-full space-y-8">
  <h1 class="text-3xl font-bold">Grant Montgomery</h1>
  <div class="max-lg:space-y-8 lg:flex lg:gap-x-4">
    <section id="activity-section" class="max-w-140 min-w-70 flex-3 space-y-4">
      <h2 class="text-2xl font-bold">Active projects</h2>
      {#each activeProjects as project (project.title)}
        {#if project.url}
          <a href={project.url} class="group block">
            {@render ProjectSummary(project)}
          </a>
        {:else}
          {@render ProjectSummary(project)}{/if}
      {/each}
    </section>
    <section id="about-section" class="@container min-w-70 flex-2 space-y-4">
      <h2 class="text-2xl font-bold">About</h2>
      <div>
        <p>
          Grant works as a full-stack web developer in the healthcare industry, working primarily
          with React and Stencil on the frontend, and Node or Springboot on the backend.
        </p>
        <div class="mx-auto flex max-w-md flex-row flex-wrap justify-around gap-6 text-center">
          <a href="https://twitter.com/lettucebowler" class="group p-4">
            <TwitterIcon class="mx-auto size-10 fill-frost-300" />
            <span class="group-hover:underline">@Lettucebowler</span>
          </a>
          <a href="https://github.com/lettucebowler" class="group p-4">
            <GithubIcon class="mx-auto size-10 fill-swamp-green-500" />
            <span class="group-hover:underline">@Lettucebowler</span>
          </a>
          <a href="/Resume.pdf" target="_blank" class="group p-4">
            <ResumeIcon class="mx-auto size-10 text-antique-brass-500" />
            <span class="group-hover:underline">Resume </span>
          </a>
        </div>
      </div>
      <section class="space-y-2">
        <h3 class="text-xl font-bold">Currently reading</h3>
        <div class="grid gap-4 @min-[400px]:grid-cols-2">
          {#each currentBooks as book (book.isbn)}
            <Book {...book} />
          {/each}
        </div>
      </section>
      <section class="space-y-2">
        <div class="grid gap-4 @min-[400px]:grid-cols-2">
          <section class="space-y-2">
            <h3 class="text-xl font-bold">Last read</h3>
            <Book {...latestBook} />
          </section>
          <section class="space-y-2">
            <h3 class="text-xl font-bold">Last watched</h3>
            <Movie {...latestMovie} />
          </section>
        </div>
      </section>
    </section>
  </div>
</main>

{#snippet ProjectSummary({ title, summary }: { title: string; summary: string })}
  <h3 class="text-lg font-bold text-swamp-green-500 capitalize group-hover:underline">{title}</h3>
  <p>{summary}</p>
{/snippet}
