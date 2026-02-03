<script lang="ts">
  import { allPosts } from 'content-collections';
</script>

<h1 class="mb-8 text-3xl font-bold">Posts</h1>
<ul class="space-y-6">
  {#each allPosts.sort((a, b) => (a.date > b.date ? -1 : 1)) as post}
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
