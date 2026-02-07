<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
</script>

<main class="mx-auto">
  <div
    class="mx-auto prose max-w-full prose-brand sm:max-w-screen-md prose-headings:font-bold prose-h1:text-3xl prose-a:cursor-pointer prose-a:text-putty-500 prose-figure:pointer-events-none prose-figcaption:text-sm prose-figcaption:text-charade-50"
  >
    <data.content />
  </div>
</main>
