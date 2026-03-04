<script module lang="ts">
  function createAnchorName(type: LogEntryType, id: number, watched: string) {
    return `${type}-${id}-${watched}`;
  }
</script>

<script lang="ts">
  import type { LogEntryType } from '$lib/schemas';
  import StarIcon from 'phosphor-svelte/lib/StarIcon';
  import ChatCenteredDotsIcon from 'phosphor-svelte/lib/ChatCenteredDotsIcon';

  type MediaCardProps = {
    title: string;
    year: number;
    contributors: Array<string>;
    rating?: number;
    comment?: string;
    type: LogEntryType;
    id: number;
    completed?: string;
    revisited?: boolean;
    subtitle?: string;
  };
  let {
    title,
    year,
    contributors,
    rating,
    comment,
    type,
    id,
    completed,
    revisited = false,
    subtitle
  }: MediaCardProps = $props();
</script>

<div class="@container">
  <figure class="gap-x-4 @max-[17rem]:space-y-2 @min-[17rem]:flex">
    <div class="max-w-30 min-w-30 flex-2 shadow-sm @max-[18rem]:max-w-44">
      <a
        href={type === 'movie'
          ? `https://www.themoviedb.org/movie/${id}`
          : `https://openlibrary.org/isbn/${id}`}
        class="block"
      >
        <img
          loading="lazy"
          class="aspect-2/3 w-full rounded"
          alt={title}
          src={type === 'movie' ? `/posters/movie-${id}.webp` : `/covers/book-${id}.webp`}
        />
      </a>
    </div>
    <figcaption class="min-w-40 flex-3">
      <h3>
        <span class="font-medium">{title} </span>
        <span class="font-light text-charade-100">{year}</span>
      </h3>
      {#if subtitle}
        <p class="mb-1 font-light text-charade-100">{subtitle}</p>
      {/if}
      <ul>
        {#each contributors as contributor}
          <li class="font-light text-charade-100 not-last:after:content-[',']">{contributor}</li>
        {/each}
      </ul>
      <div class="group flex gap-x-2">
        {#if comment && completed}
          <div class="contents @min-[17rem]:hidden">
            <button
              aria-label="movie comment for {title}"
              popovertarget={createAnchorName(type, id, completed)}
              class="flex cursor-pointer items-center gap-2"
              style="anchor-name: --{createAnchorName(type, id, completed)}"
              id="{type}-comment-{id}"
            >
              <ChatCenteredDotsIcon
                weight="fill"
                class="size-4 cursor-pointer group-hover:text-swamp-green-500"
              />
            </button>
            <div
              id={createAnchorName(type, id, completed)}
              popover
              style="position-anchor: --{createAnchorName(
                type,
                id,
                completed
              )};  position-area: block-end span-inline-end; position-try-fallbacks:flip-inline;"
              class="mt-2 max-w-100 border border-charade-600 bg-charade-950 p-6 shadow-sm"
            >
              <p class="text-charade-50">{comment}</p>
            </div>
          </div>
        {/if}
        {#if rating}
          <svelte:element
            this={comment ? 'label' : 'div'}
            class="my-1.5 flex items-center gap-0.5 text-putty-500"
            for={comment ? `${type}-comment-${id}` : undefined}
          >
            {#each { length: rating }, i (i)}
              <StarIcon weight="fill" class="size-3 group-hover:scale-105" />
            {/each}
          </svelte:element>
        {/if}
        {#if revisited}
          <p class="font-bold text-antique-brass-500 italic">
            {type === 'movie' ? 'rewatch' : 'reread'}
          </p>
        {/if}
      </div>
      {#if comment}
        <p class="mt-2 font-thin text-charade-100 @max-[17rem]:hidden">{comment}</p>
      {/if}
    </figcaption>
  </figure>
</div>
