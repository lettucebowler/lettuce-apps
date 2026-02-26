<script module lang="ts">
  function createAnchorName(type: LogEntryType, id: number, watched: string) {
    return `${type}-${id}-${watched}`;
  }
</script>

<script lang="ts">
  import type { LogEntryType } from '$lib/schemas';

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
  <figure
    class="@max-[17rem]:space-y-2 @min-[17rem]:flex @min-[17rem]:gap-x-2 @min-[20rem]:gap-x-4"
  >
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
