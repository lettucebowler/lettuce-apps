<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<div class="flex w-full flex-col items-center pt-10">
  {@render children()}
</div>
