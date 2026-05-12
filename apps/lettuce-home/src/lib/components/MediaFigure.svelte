<script lang="ts" module>
  type MediaInfo = {
    title: string;
    subtitle?: string;
    contributors: Array<string>;
    href: string;
    imageSrc: string;
    year: number;
    comment?: string;
    rating?: number;
    feature?: Snippet;
  };

  type MediaFigureProps = MediaInfo & {
    headingTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  };
</script>

<script lang="ts">
  import ChatCenteredDotsIcon from 'phosphor-svelte/lib/ChatCenteredDotsIcon';
  import { Popover } from 'bits-ui';
  import StarIcon from 'phosphor-svelte/lib/StarIcon';
  import type { Snippet } from 'svelte';

  const {
    title,
    subtitle,
    contributors,
    href,
    imageSrc,
    year,
    comment,
    rating,
    feature,
    headingTag = 'h3',
  }: MediaFigureProps = $props();

  const uid = $props.id();
</script>

<div class="@container">
  <figure class="gap-x-4 @max-[17rem]:space-y-3 @min-[17rem]:flex">
    <div class="max-w-30 min-w-30 flex-2 shadow-sm @max-[18rem]:max-w-44">
      <a {href} class="block">
        <img class="aspect-2/3 w-full rounded" loading="lazy" alt={title} src={imageSrc} />
      </a>
    </div>
    <figcaption class="min-w-40 flex-3">
      <svelte:element this={headingTag ?? 'h3'}>
        <span class="font-medium">{title} </span>
        <span class="text-charade-200">{year}</span>
      </svelte:element>
      {#if subtitle}
        <p class=" text-charade-200">{subtitle}</p>
      {/if}
      {#if contributors.length}
        <ul class={[subtitle && 'mt-1']}>
          {#each contributors as contributor}
            <li class="text-charade-200">{contributor}</li>
          {/each}
        </ul>
      {/if}
      <div class="flex gap-x-2" id="media-figure-{uid}-rating-bar">
        <div class={['group flex gap-x-2', comment && 'hover:cursor-pointer']}>
          {#if comment}
            <div class="hidden @max-[17rem]:contents">
              <Popover.Root>
                <Popover.Trigger>
                  <ChatCenteredDotsIcon weight="fill" class="size-4 cursor-pointer group-hover:text-swamp-green-500" />
                  {#snippet child({ props })}
                    <button
                      {...props}
                      aria-label="movie comment for {title}"
                      class="flex cursor-pointer items-center gap-2"
                      id="media-figure-{uid}-comment-trigger"
                    >
                      <ChatCenteredDotsIcon
                        weight="fill"
                        class="size-4 cursor-pointer group-hover:text-swamp-green-500"
                      />
                    </button>
                  {/snippet}
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    class="shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-30 w-full max-w-[328px] origin-(--bits-popover-content-transform-origin) rounded border border-charade-700 bg-charade-950 p-4"
                    align="center"
                    alignOffset={100}
                    customAnchor="#media-figure-{uid}-rating-bar"
                  >
                    {comment}
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            </div>
          {/if}
          {#if rating}
            <svelte:element
              this={comment ? 'label' : 'div'}
              class={['my-1.5 flex items-center gap-0.5 text-putty-500']}
              for="media-figure-{uid}-comment-trigger"
            >
              {#each { length: rating }, i (i)}
                <StarIcon
                  weight="fill"
                  class={['size-3', comment && 'group-hover:scale-105 group-hover:cursor-pointer']}
                />
              {/each}
            </svelte:element>
          {/if}
        </div>
        {@render feature?.()}
      </div>
      {#if comment}
        <p class="mt-2 text-charade-100 @max-[17rem]:hidden">{comment}</p>
      {/if}
    </figcaption>
  </figure>
</div>
