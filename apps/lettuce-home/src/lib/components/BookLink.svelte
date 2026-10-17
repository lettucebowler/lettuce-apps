<script lang="ts">
  import type { Snippet } from 'svelte';

  let { isbn, class: classname = 'italic', children }: { isbn: string; class?: string; children?: Snippet } = $props();
</script>

<a class={classname} href="https://openlibrary.org/isbn/{isbn}">{@render children?.()}</a>
