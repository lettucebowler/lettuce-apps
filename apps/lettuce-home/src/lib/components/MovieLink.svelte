<script lang="ts">
  import type { Snippet } from 'svelte';

  let { tmdb, class: classname = 'italic', children }: { tmdb: number; class?: string; children?: Snippet } = $props();
</script>

<a class={classname} href="https://www.themoviedb.org/movie/{tmdb}">{@render children?.()}</a>
