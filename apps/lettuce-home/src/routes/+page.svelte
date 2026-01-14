<script lang="ts">
  import {
    getActiveProjects,
    getCurrentlyReading,
    getLastReadBook,
    getLastWatchedMovie
  } from '$lib/collections';
  import Book from '$lib/components/Book.svelte';
  import Movie from '$lib/components/Movie.svelte';
  import GithubIcon from './GithubIcon.svelte';
  import ResumeIcon from './ResumeIcon.svelte';
  import TwitterIcon from './TwitterIcon.svelte';

  const latestBook = getLastReadBook();
  const activeProjects = getActiveProjects();
  const latestMovie = getLastWatchedMovie();
  const currentBooks = getCurrentlyReading();
</script>

<svelte:head>
  <title>Grant Montgomery</title>
</svelte:head>
<main class="mx-auto w-full space-y-8">
  <h1 class="text-3xl font-bold">Grant Montgomery</h1>
  <div id="home-layout" class="grid gap-x-4 gap-y-8 md:grid-cols-2">
    <div id="home-right" class="@container space-y-8">
      <!-- <section id="activity-section" class="space-y-4">
        <h2 class="text-2xl font-bold">Recent posts</h2>
        {#each allPosts.filter((post) => post.published).slice(0, 5) as post (post.slug)}
          {@render Post({
            title: post.title,
            summary: post.summary,
            date: post.date,
            slug: post.slug
          })}
        {/each}
      </section> -->
      <section id="activity-section" class="space-y-4">
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
    </div>
    <div id="home-left" class="@container space-y-8">
      <section class="space-y-4">
        <h2 class="text-2xl font-bold">About</h2>
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
      </section>
      <div class="grid gap-4 @min-[400px]:grid-cols-2">
        <section class="space-y-4">
          <h2 class="text-2xl font-bold">Last read</h2>
          <Book {...latestBook} />
        </section>
        <section class="space-y-4">
          <h2 class="text-2xl font-bold">Last watched</h2>
          <Movie {...latestMovie} />
        </section>
      </div>
      <section class="space-y-4">
        <h2 class="text-2xl font-bold">Currently reading</h2>
        <div class="grid gap-4 @min-[400px]:grid-cols-2">
          {#each currentBooks as book (book.isbn)}
            <Book {...book} />
          {/each}
        </div>
      </section>
    </div>
  </div>
</main>

{#snippet Post({
  title,
  summary,
  date,
  slug
}: {
  title: string;
  summary?: string;
  date: string;
  slug: string;
})}
  <a href="/posts/{slug}" class="group block">
    <h3 class="text-xl font-bold text-swamp-green-500 group-hover:underline">{title}</h3>
    {#if summary}
      <p class="">{summary}</p>
    {/if}
    {#if date}
      <p class="text-sm">
        {new Date(date).toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })}
      </p>
    {/if}
  </a>
{/snippet}

{#snippet ProjectSummary({ title, summary }: { title: string; summary: string })}
  <h3 class="text-lg font-bold text-swamp-green-500 capitalize group-hover:underline">{title}</h3>
  <p>{summary}</p>
{/snippet}
