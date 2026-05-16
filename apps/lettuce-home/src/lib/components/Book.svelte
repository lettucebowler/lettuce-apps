<script lang="ts">
  import type { ReadingLogEntry } from '$lib/schemas';
  import MediaFigure from './MediaFigure.svelte';

  type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

  let {
    title,
    subtitle,
    authors,
    published,
    reread = false,
    comment,
    rating,
    imageSrc,
    url,
  }: Optional<Omit<ReadingLogEntry, 'type' | 'logDate'>, 'reread'> = $props();
</script>

{#snippet feature()}
  <p class="font-bold text-antique-brass-500 italic">reread</p>
{/snippet}

<MediaFigure
  {title}
  {subtitle}
  contributors={authors}
  year={published}
  {comment}
  {rating}
  {imageSrc}
  href={url}
  feature={reread ? feature : undefined}
/>
