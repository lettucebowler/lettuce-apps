<script lang="ts">
  import { page } from '$app/state';
  import { getAllPostTags, getPostsByYear } from '$lib/collections';
  import Post from '$lib/components/Post.svelte';
  const postGroups = $derived.by(() => getPostsByYear(page.url.searchParams.get('tag')));
  const tags = getAllPostTags();
</script>

<svelte:head>
  <title>Posts | Grant Montgomery</title>
</svelte:head>
<main class="">
  <h1 class="mb-8 text-3xl font-bold">Posts</h1>
  <nav class="mb-8">
    <div class="mb-1 inline-block text-lg">Filter:</div>
    <ul class="flex gap-2">
      <li>
        <a href="/posts" class="inline-flex font-light text-frost-100 hover:underline">all</a>
      </li>
      {#each tags as tag (tag)}
        <li>
          <a href="/posts?tag={tag}" class="inline-flex font-light text-frost-100 hover:underline"
            >#{tag}</a
          >
        </li>
      {/each}
    </ul>
  </nav>
  <div class="space-y-8">
    {#each postGroups as group (group.title)}
      <div class="space-y-2">
        <header>
          <h2 class="inline text-2xl font-bold">{group.title}</h2>
          &nbsp;
          <span class=" font-medium text-charade-100"
            >{group.items.length} {group.items.length > 1 ? 'posts' : 'post'}</span
          >
        </header>
        <ul class="space-y-4">
          {#each group.items as post (post.slug)}
            <li>
              <Post {...post} />
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</main>
