<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.meta.title} | Grant Montgomery</title>
</svelte:head>
<main class="max-w-3xl">
  <h1 class="mb-8 text-3xl font-bold">{data.meta.title}</h1>
  <div class="flex gap-x-4">
    <time
      >{new Date(data.meta.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC'
      })}</time
    >
    <nav>
      <ul class="m-0! flex list-none gap-2 p-0!">
        {#each data.meta.tags as tag (tag)}
          <li class="m-0! p-0!">
            <a href="/posts?tag={tag}" class="inline-flex text-frost-100! hover:underline">#{tag}</a>
          </li>
        {/each}
      </ul>
    </nav>
  </div>
  <div
    class="mx-auto prose mt-4 mb-40 prose-brand sm:max-w-3xl prose-headings:font-bold prose-h1:mb-8 prose-h1:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:mt-4 prose-h3:mb-2 prose-h3:text-lg prose-h3:font-bold prose-a:cursor-pointer prose-a:text-putty-500 prose-img:w-full"
  >
    <data.content />
  </div>
</main>
