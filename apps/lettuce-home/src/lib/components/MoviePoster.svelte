<script lang="ts">
  import type { MovieLogEntry } from '$lib/schemas';
  import type { Picture } from '@sveltejs/enhanced-img';

  type Props = Pick<MovieLogEntry, 'tmdb' | 'title'>;
  let { tmdb, title }: Props = $props();

  const images = import.meta.glob('$lib/assets/media/posters/*.webp', {
    eager: true,
    import: 'default',
    query: {
      w: '240',
    },
  });
  const image = $derived.by(() => {
    const path = Object.keys(images).find((key) => key.includes(tmdb.toString()));
    if (!path) {
      return undefined;
    }
    return images[path];
  }) as Picture;
</script>

<enhanced:img src={image} alt={title} class="aspect-2/3 w-full rounded shadow-lg" loading="lazy" />
