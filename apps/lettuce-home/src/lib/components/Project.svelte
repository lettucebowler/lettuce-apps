<script lang="ts">
  import type { Project } from 'content-collections';
  import ExternalLinkIcon from './ExternalLinkIcon.svelte';

  type Props = {
    heading?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    headingClassname?: string;
  } & Project;

  let {
    title,
    summary,
    status,
    description,
    url,
    heading = 'h3',
    headingClassname = 'font-medium inline-block mb-2 text-xl'
  }: Props = $props();
</script>

<article>
  {#if url}
    <a href={url} class="group inline text-swamp-green-500">
      {@render Title({ title, heading, classname: [headingClassname, 'underline'] })}
      <ExternalLinkIcon class="mb-3 inline-block size-3.5" />
    </a>
  {:else}
    <div class="">
      {@render Title({ title, heading, classname: headingClassname })}
    </div>
  {/if}
  <div class="space-y-1">
    <p>{summary}</p>
    <dl class="flex">
      <dt>status:</dt>
      &nbsp;
      <dd
        class={[
          'font-medium',
          status === 'active' && 'text-frost-200',
          status === 'inactive' && 'text-putty-500',
          status === 'offline' && 'text-contessa-500'
        ]}
      >
        {status}
      </dd>
    </dl>
    {#each description as paragraph (paragraph)}
      <p>{paragraph}</p>
    {/each}
  </div>
</article>

{#snippet Title({
  title,
  heading,
  classname
}: {
  title: string;
  heading: string;
  classname: string | string[];
})}
  <svelte:element this={heading} class={classname}>{title}</svelte:element>
{/snippet}
