<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.meta.title} | Grant Montgomery</title>
</svelte:head>
<main class="mx-auto">
  <div
    class="mx-auto prose max-w-full prose-brand sm:max-w-screen-md prose-headings:font-bold prose-h1:text-3xl prose-a:cursor-pointer prose-a:text-putty-500"
  >
    <h1>{data.meta.title}</h1>
    <div class="flex gap-x-4">
      <time
        >{new Date(data.meta.date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          timeZone: 'UTC'
        })}</time
      >
      <nav class="mb-6">
        <ul class="m-0! flex list-none gap-2 p-0!">
          {#each data.meta.tags as tag (tag)}
            <li class="m-0! p-0!">
              <a
                href="/posts?tag={tag}"
                class="inline-flex font-thin text-frost-100! hover:underline">#{tag}</a
              >
            </li>
          {/each}
        </ul>
      </nav>
    </div>
    <data.content />
  </div>
</main>
