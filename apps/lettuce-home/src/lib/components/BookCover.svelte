<script lang="ts">
  import type { ReadingLogEntry } from '$lib/schemas';
  import type { Picture } from '@sveltejs/enhanced-img';

  type Props = Pick<ReadingLogEntry, 'isbn' | 'title'>;
  let { isbn, title }: Props = $props();

  const images = import.meta.glob('$lib/assets/media/covers/*.webp', {
    eager: true,
    import: 'default',
    query: {
      w: '240',
    },
  });
  const image = $derived.by(() => {
    const path = Object.keys(images).find((key) => key.includes(isbn));
    if (!path) {
      return undefined;
    }
    return images[path];
  }) as Picture;
</script>

<enhanced:img src={image} alt={title} class="aspect-2/3 w-full rounded shadow-lg" loading="lazy" />
