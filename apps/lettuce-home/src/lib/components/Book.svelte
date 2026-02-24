<script lang="ts">
  import type { ReadingLogEntry } from '$lib/schemas';
  import MediaCard from './MediaCard.svelte';

  let {
    title,
    subtitle,
    authors,
    isbn,
    published,
    reread,
    comment,
    completed,
    rating
  }: ReadingLogEntry = $props();

  function createAnchorName(isbn: number, completed: string = 'current') {
    return `book-${isbn}-${completed}`;
  }
</script>

<MediaCard>
  {#snippet media()}
    <a href="https://openlibrary.org/isbn/{isbn}">
      <img
        loading="lazy"
        alt={`${title}${subtitle ? ': ' + subtitle : ''}`}
        src="/covers/book-{isbn}.webp"
        class="aspect-2/3 w-full rounded"
      />
    </a>
  {/snippet}
  {#snippet info()}
    <h3 class="">
      <span class="font-medium">{title}</span>
      <span class="font-light text-charade-100">{published}</span>
    </h3>
    {#if subtitle}
      <p class="font-light text-charade-100">{subtitle}</p>
    {/if}
    <ul class="">
      {#each authors as author}
        <li class="font-light text-charade-100">{author}</li>
      {/each}
    </ul>
    <div class="group flex gap-x-2">
      {#if comment}
        <button
          aria-label="movie comment for {title}"
          popovertarget={createAnchorName(isbn, completed)}
          class="flex cursor-pointer items-center gap-2"
          style="anchor-name: --{createAnchorName(isbn, completed)}"
          id="movie-comment-{isbn}"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-4 group-hover:text-swamp-green-500"
          >
            <path
              fill-rule="evenodd"
              d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <div
          id={createAnchorName(isbn, completed)}
          popover
          style="position-anchor: --{createAnchorName(
            isbn,
            completed
          )};  position-area: block-end span-inline-end; position-try-fallbacks:flip-inline;"
          class="mt-2 max-w-100 border border-charade-600 bg-charade-950 p-6 shadow-sm"
        >
          <p class="text-charade-50">{comment}</p>
        </div>
      {/if}
      {#if rating}
        <svelte:element
          this={comment ? 'label' : 'div'}
          class="my-1.5 flex items-center gap-0.5 text-putty-500"
          for={comment ? `movie-comment-${isbn}` : undefined}
        >
          {#each { length: rating }, i (i)}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class={['size-3', comment && 'cursor-pointer group-hover:scale-110']}
            >
              <path
                fill-rule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                clip-rule="evenodd"
              />
            </svg>
          {/each}
        </svelte:element>
      {/if}
      {#if reread}
        <p class="font-bold text-antique-brass-500 italic">reread</p>
      {/if}
    </div>
  {/snippet}
</MediaCard>
