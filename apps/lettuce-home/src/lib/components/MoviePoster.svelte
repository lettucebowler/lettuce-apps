<script lang="ts">
  import type { MovieLogEntry } from '$lib/schemas';
  import type { Picture } from '@sveltejs/enhanced-img';
  import { object } from 'valibot';

  type Props = Pick<MovieLogEntry, 'tmdb' | 'title'>;
  let { tmdb, title }: Props = $props();

  const images = import.meta.glob('$lib/assets/media/posters/*', {
    eager: true,
    import: 'default',
    query: {
      enhanced: true,
      w: '240',
      h: '360',
      format: 'avif;webp',
    },
  });
  const image = $derived.by(() => {
    const path = Object.keys(images).find((key) => key.includes(`movie-${tmdb}.`));
    if (!path) {
      return undefined;
    }
    return images[path];
  }) as Picture;
</script>

<enhanced:img src={image} alt={title} class="aspect-2/3 w-full rounded shadow-lg" loading="lazy" />
