<script lang="ts">
  import { getPostsByYear } from '#lib/collections';
  import Post from '#lib/components/Post.svelte';

  const { params } = $props();

  const postGroups = $derived.by(() => {
    const tag = params.tag;
    return getPostsByYear((post) => !!post.tags?.includes(tag));
  });
</script>

<svelte:head>
  <title>#{params.tag} | Grant Montgomery</title>
</svelte:head>
<main class="max-w-3xl">
  <h1 class="mb-8 text-3xl font-bold">#{params.tag}</h1>
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
