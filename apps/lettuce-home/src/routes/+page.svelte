<script lang="ts">
  import {
    getActiveProjects,
    getCurrentlyReading,
    getLastReadBook,
    getLastWatchedMovie,
    getRecentPosts,
  } from '$lib/collections';
  import Book from '$lib/components/Book.svelte';
  import Movie from '$lib/components/Movie.svelte';
  import Post from '$lib/components/Post.svelte';
  import Project from '$lib/components/Project.svelte';

  const latestBook = getLastReadBook();
  const activeProjects = getActiveProjects();
  const latestMovie = getLastWatchedMovie();
  const recentPosts = getRecentPosts();
  const currentBook = getCurrentlyReading().at(0);
</script>

<svelte:head>
  <title>Grant Montgomery</title>
</svelte:head>
<main class="@container mx-auto">
  <div class="grid gap-x-8 gap-y-12 md:grid-cols-2">
    <div id="home-left" class="@container max-w-160 space-y-8">
      <section class=" space-y-4">
        <h1 class="mb-8 text-3xl font-bold">Grant Montgomery</h1>
        <p>
          Grant works as a full-stack web developer in the healthcare industry, working primarily with React and Stencil
          on the frontend, and Node or Springboot on the backend.
        </p>
        <div
          class="mx-auto flex max-w-120 flex-col flex-wrap justify-center text-center @min-[20rem]:flex-row @min-[30rem]:grid @min-[30rem]:grid-cols-3"
        >
          <a href="https://twitter.com/lettucebowler" class="group flex flex-col justify-between p-4">
            <span class="mx-auto icon-[mdi--twitter] size-10 text-frost-300"></span>
            <span class="group-hover:underline">@Lettucebowler</span>
          </a>
          <a href="https://github.com/lettucebowler" class="group flex flex-col justify-between p-4">
            <span class="mx-auto icon-[mdi--github] size-10 text-swamp-green-500"></span>
            <span class="group-hover:underline">@Lettucebowler</span>
          </a>
          <a href="/Resume.pdf" target="_blank" class="group flex flex-col justify-between p-4">
            <span class="mx-auto icon-[heroicons--document-text-solid] block size-10 text-antique-brass-500"></span>
            <span class="group-hover:underline">Resume </span>
          </a>
        </div>
      </section>
      <section id="activity-section" class="space-y-4">
        <h2 class="text-2xl font-bold">
          Latest posts<a href="/posts" class="ml-8 text-base font-medium text-charade-100 underline">View all posts →</a
          >
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
    <div id="home-right" class="@container w-full space-y-8 md:ml-auto md:max-w-120">
      {#if currentBook}
        <section class={['space-y-4']}>
          <h2 class="text-2xl font-bold">Currently reading</h2>
          <Book {...currentBook} />
        </section>
      {/if}
      <section class="space-y-4">
        <h2 class="text-2xl font-bold">Last read</h2>
        <Book {...latestBook} />
      </section>
      <section class="space-y-4">
        <h2 class="text-2xl font-bold">Last watched</h2>
        <Movie {...latestMovie} />
      </section>
    </div>
  </div>
</main>
