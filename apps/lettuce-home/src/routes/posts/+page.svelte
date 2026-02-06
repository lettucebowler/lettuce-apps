<script lang="ts">
  import { getPostsDesc } from '$lib/collections';
  import Post from '$lib/components/Post.svelte';
  const posts = getPostsDesc();
</script>

<main class="">
  <h1 class="mb-8 text-3xl font-bold">Posts</h1>
  <ul class="space-y-4">
    {#each posts as post}
      <li>
        <Post {...post} />
      </li>
    {/each}
  </ul>
</main>
