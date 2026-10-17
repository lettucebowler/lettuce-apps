<script lang="ts">
  import type { ReadingLogEntry } from '#lib/schemas.js';
  import type { Picture } from '@sveltejs/enhanced-img';

  type Props = Pick<ReadingLogEntry, 'isbn' | 'title'>;
  let { isbn, title }: Props = $props();

  const images = import.meta.glob('#lib/assets/book-covers/*', {
    eager: true,
    import: 'default',
    query: {
      enhanced: true,
      w: '240',
      h: '360',
      format: 'avif;webp',
    },
  });

  function getBookCoverImage(isbn: string) {
    const path = Object.keys(images).find((key) => key.includes(`book-${isbn}`));
    if (!path) {
      throw new Error(`no image for isbn: ${isbn}`);
    }
    return images[path] as Picture;
  }
</script>

<enhanced:img src={getBookCoverImage(isbn)} alt={title} class="aspect-2/3 w-full rounded shadow-lg" loading="lazy" />
