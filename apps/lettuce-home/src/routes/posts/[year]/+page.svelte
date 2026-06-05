<script lang="ts">
  import { filterPosts } from '$lib/collections';
  import Post from '$lib/components/Post.svelte';

  const { params } = $props();
  const posts = filterPosts((post) => post.date.substring(0, 4) === params.year);
</script>

<svelte:head>
  <title>{params.year} | Grant Montgomery</title>
</svelte:head>

<main class="max-w-3xl">
  <h1 class="mb-8 text-3xl font-bold">{params.year}</h1>
  <div class="space-y-8">
    <ul class="space-y-4">
      {#each posts as post (post.slug)}
        <li>
          <Post {...post} />
        </li>
      {:else}
        <p>No posts for you!</p>
      {/each}
    </ul>
  </div>
</main>
