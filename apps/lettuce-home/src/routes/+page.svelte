<script lang="ts">
  // import { getActiveProjects, getLastReadBook, getLastWatchedMovie, getRecentPosts } from '$lib/collections';
  import Book from '$lib/components/Book.svelte';
  import Movie from '$lib/components/Movie.svelte';
  import Post from '$lib/components/Post.svelte';
  import Project from '$lib/components/Project.svelte';
  import GithubIcon from './GithubIcon.svelte';
  import ResumeIcon from 'phosphor-svelte/lib/FileTextIcon';
  import TwitterIcon from './TwitterIcon.svelte';
  import {
    getCurrentlyReading,
    getLastReadBook,
    getActiveProjects,
    getLastWatchedMovie,
    getRecentPosts
  } from '$lib/remote/content.remote';

  const latestBook = await getLastReadBook();
  const activeProjects = await getActiveProjects();
  const latestMovie = await getLastWatchedMovie();
  const currentBooks = await getCurrentlyReading();
  const recentPosts = await getRecentPosts();
</script>

<svelte:head>
  <title>Grant Montgomery</title>
</svelte:head>
<main class="mx-auto grid gap-x-8 gap-y-12 md:grid-cols-[1fr_20rem] lg:grid-cols-[30rem_1fr]">
  <div id="home-left" class="@container space-y-8">
    <section id="activity-section" class="space-y-4">
      <h2 class="text-2xl font-bold">
        Latest posts<a href="/posts" class="ml-8 text-base font-medium text-charade-100 underline">View all posts →</a>
      </h2>
      {#each recentPosts as post (post.slug)}
        <Post {...post} />
      {/each}
    </section>
    {#if activeProjects.length}
      <section id="activity-section" class="space-y-4">
        <h2 class="text-2xl font-bold">
          Active projects <a href="/projects" class="ml-8 text-base font-medium text-charade-100 underline"
            >View all projects →</a
          >
        </h2>
        {#each activeProjects as project (project.title)}
          {@const { description, ...rest } = project}
          <Project {...rest} description={[]} />
        {/each}
      </section>
    {/if}
  </div>
  <div id="home-right" class="@container space-y-12">
    <section class="space-y-4">
      <h1 class="mb-8 text-3xl font-bold">Grant Montgomery</h1>
      <p>
        Grant works as a full-stack web developer in the healthcare industry, working primarily with React and Stencil
        on the frontend, and Node or Springboot on the backend.
      </p>
      <div
        class="mx-auto flex max-w-120 flex-col flex-wrap justify-center text-center @min-[20rem]:flex-row @min-[30rem]:grid @min-[30rem]:grid-cols-3"
      >
        <a href="https://twitter.com/lettucebowler" class="group p-4">
          <TwitterIcon class="mx-auto size-10 fill-frost-300" />
          <span class="group-hover:underline">@Lettucebowler</span>
        </a>
        <a href="https://github.com/lettucebowler" class="group p-4">
          <GithubIcon class="mx-auto size-10 fill-swamp-green-500" />
          <span class="group-hover:underline">@Lettucebowler</span>
        </a>
        <a href="/Resume.pdf" target="_blank" class="group p-4">
          <ResumeIcon class="mx-auto size-10 text-antique-brass-500" weight="fill" />
          <span class="group-hover:underline">Resume </span>
        </a>
      </div>
    </section>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-x-4 gap-y-8">
      {#if currentBooks.length}
        <section
          class={[
            'space-y-4',
            currentBooks.length === 1 && 'col-span-1',
            currentBooks.length > 1 && '@min-[36.25rem]:col-span-2',
            currentBooks.length > 2 && '@min-[54rem]:col-span-3'
          ]}
        >
          <h2 class="text-2xl font-bold">Currently reading</h2>
          <div class="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-x-4 gap-y-6">
            {#each currentBooks as book (book.isbn)}
              <div class="min-w-[18rem] flex-1 basis-auto">
                <Book {...book} />
              </div>
            {/each}
          </div>
        </section>
      {/if}
      <section class="min-w-[18rem] flex-1 basis-auto space-y-4">
        <h2 class="text-2xl font-bold">Last read</h2>
        <Book {...latestBook} />
      </section>
      <section class="min-w-[18rem] flex-1 basis-auto space-y-4">
        <h2 class="text-2xl font-bold">Last watched</h2>
        <Movie {...latestMovie} />
      </section>
    </div>
  </div>
</main>
