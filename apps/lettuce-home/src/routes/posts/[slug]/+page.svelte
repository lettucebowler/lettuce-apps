<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.meta.title} | Grant Montgomery</title>
</svelte:head>
<main class="mx-auto">
  <div
    class="mx-auto prose mb-40 prose-brand sm:max-w-3xl prose-headings:font-bold prose-h1:mb-8 prose-h1:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-a:cursor-pointer prose-a:text-putty-500 prose-img:w-full"
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
      <nav>
        <ul class="m-0! flex list-none gap-2 p-0!">
          {#each data.meta.tags as tag (tag)}
            <li class="m-0! p-0!">
              <a
                href="/posts?tag={tag}"
                class="inline-flex font-light text-frost-100! hover:underline">#{tag}</a
              >
            </li>
          {/each}
        </ul>
      </nav>
    </div>
    <data.content />
  </div>
</main>
