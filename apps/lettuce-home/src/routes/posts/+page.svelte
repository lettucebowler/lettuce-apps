<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<h1 class="mb-8 text-3xl font-bold">Posts</h1>
<ul>
  {#each data.posts as post}
    <li>
      <a href="/posts/{post.slug}">
        <h2 class="text-xl font-bold text-swamp-green-500">{post.title}</h2>
        {#if post.summary}
          <p class="mb-1">{post.summary}</p>
        {/if}
        <p>
          {new Date(post.date).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </p></a
      >
    </li>
  {/each}
</ul>
