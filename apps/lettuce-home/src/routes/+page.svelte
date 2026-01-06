<script lang="ts">
  import Book from '$lib/components/Book.svelte';
  import Movie from '$lib/components/Movie.svelte';
  import { getLatestMovie } from '$lib/remote/movie-log.remote';
  import { getActiveProjects, getProjects } from '$lib/remote/projects.remote';
  import { getCurrentBooks, getLastReadBook } from '$lib/remote/reading-log.remote';
  import GithubIcon from './GithubIcon.svelte';
  import ResumeIcon from './ResumeIcon.svelte';
  import TwitterIcon from './TwitterIcon.svelte';

  const latestBook = $derived(await getLastReadBook());
  const activeProjects = $derived(await getActiveProjects());
  const latestMovie = $derived(await getLatestMovie());
  const currentBooks = $derived(await getCurrentBooks());
</script>

<main class="bg:green-500 mx-auto flex w-full flex-wrap gap-6">
  <div class="flex w-full justify-start gap-6">
    <h1 class="text-3xl font-bold">Grant Montgomery</h1>
    <img
      alt="Lettucebowler"
      class="my-auto inline size-9 rounded-md"
      src="https://api.dicebear.com/9.x/bottts-neutral/svg?backgroundColor=BF616A&backgroundColor=D08770&backgroundColor=EBCB8B&backgroundColor=A3BE8C&backgroundColor=B48EAD&backgroundColor=88C0D0&backgroundType=gradientLinear&seed=lettucebowler"
    />
  </div>
  <div class="grid min-w-[270px] flex-1 content-start gap-4">
    <h2 class="text-2xl font-bold">Active projects</h2>
    {#each activeProjects as project (project.title)}
      {#if project.url}
        <a href={project.url} class="group">
          {@render ProjectSummary(project)}
        </a>
      {:else}
        {@render ProjectSummary(project)}{/if}
    {/each}
  </div>
  <div class="@container grid min-w-[270px] flex-1 content-start gap-4">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">About</h2>
      <p>
        Grant works as a full-stack web developer in the healthcare industry, working primarily with
        React and Stencil on the frontend, and Node or Springboot on the backend.
      </p>
    </div>
    <div class="flex flex-row flex-wrap justify-center gap-6 text-center">
      <a href="https://twitter.com/lettucebowler" class="group">
        <TwitterIcon class="mx-auto size-10 fill-frost-300" />
        <span class="group-hover:underline">@Lettucebowler</span>
      </a>
      <a href="https://github.com/lettucebowler" class="group">
        <GithubIcon class="mx-auto size-10 fill-swamp-green-500" />
        <span class="group-hover:underline">@Lettucebowler</span>
      </a>
      <a href="/Resume.pdf" target="_blank" class="group">
        <ResumeIcon class="mx-auto size-10 text-antique-brass-500" />
        <span class="group-hover:underline">Resume </span>
      </a>
    </div>
    <div class="space-y-2">
      <h2 class="text-xl font-bold">Currently reading</h2>
      <div class="grid grid-cols-1 gap-4 @md:grid-cols-2">
        {#each currentBooks as book (book.isbn)}
          <Book {...book} />
        {/each}
      </div>
    </div>
    <div class="grid gap-4 @md:grid-cols-2">
      <div class="space-y-2">
        <h2 class="text-xl font-bold">Last read</h2>
        <Book {...latestBook} />
      </div>
      <div class="space-y-2">
        <h2 class="text-xl font-bold">Last watched</h2>
        <Movie {...latestMovie} />
      </div>
    </div>
  </div>
</main>

{#snippet ProjectSummary({ title, summary }: { title: string; summary: string })}
  <h3 class="text-lg font-bold text-swamp-green-500 capitalize group-hover:underline">{title}</h3>
  <p>{summary}</p>
{/snippet}
