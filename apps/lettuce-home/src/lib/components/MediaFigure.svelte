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
  import { Popover } from 'bits-ui';
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

<div class="@container min-w-43">
  <figure class="flex flex-col gap-x-4 gap-y-3 @min-[18.5rem]:flex-row">
    <a {href} class="mb-auto block w-full max-w-60 flex-1 @min-[18.5rem]:max-w-40 @min-[18.5rem]:flex-1">
      <img class="aspect-2/3 w-full rounded shadow-lg" loading="lazy" alt={title} src={imageSrc} />
    </a>
    <figcaption class="w-full min-w-40 @min-[18.5rem]:flex-2">
      <svelte:element this={headingTag ?? 'h3'}>
        <span class="font-medium">{title}{subtitle ? ':' : ''}</span>
        {#if subtitle}
          <span class="text-charade-200">{subtitle}</span>
        {/if}
        <span class="text-charade-100">({year})</span>
      </svelte:element>
      <!-- {#if subtitle}
        <p class=" text-charade-200">{subtitle}</p>
      {/if} -->
      {#if contributors.length}
        <ul>
          {#each contributors as contributor}
            <li class="text-charade-100">{contributor}</li>
          {/each}
        </ul>
      {/if}
      <div class="mt-1 flex gap-x-2" id="media-figure-{uid}-rating-bar">
        {#if comment || rating}
          <div class={['group flex gap-x-2', comment && 'hover:cursor-pointer']}>
            {#if rating}
              <svelte:element
                this={comment ? 'label' : 'div'}
                class={['flex items-center gap-0.5 text-putty-500']}
                for="media-figure-{uid}-comment-trigger"
              >
                {#each { length: 5 }, i (i)}
                  <span
                    class={[
                      'size-4',
                      comment && 'group-hover:cursor-pointer',
                      i < rating ? 'icon-[heroicons--star-solid]' : 'icon-[heroicons--star]',
                    ]}
                  ></span>
                {/each}
              </svelte:element>
            {/if}
            {#if comment}
              <div class="hidden @max-[17rem]:contents">
                <Popover.Root>
                  <Popover.Trigger>
                    {#snippet child({ props })}
                      <button
                        {...props}
                        aria-label="movie comment for {title}"
                        class="flex cursor-pointer items-center gap-2"
                        id="media-figure-{uid}-comment-trigger"
                      >
                        <span
                          class="icon-[heroicons--chat-bubble-left-ellipsis-solid] size-4 cursor-pointer group-hover:text-swamp-green-500"
                        ></span>
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
          </div>
        {/if}
        {@render feature?.()}
      </div>
      {#if comment}
        <p class="mt-2 text-charade-100 @max-[17rem]:hidden">{comment}</p>
      {/if}
    </figcaption>
  </figure>
</div>
