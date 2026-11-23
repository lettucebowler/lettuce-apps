<script lang="ts">
  import NavBar from '#lib/components/NavBar.svelte';
  import NavLink from '#lib/components/NavLink.svelte';
  import { PageContentContainer } from '#lib/index.js';
  import '../app.css';
  let { children } = $props();
</script>

<PageContentContainer>
  <div class="p-2 min-[800px]:px-0 sm:p-4">
    <NavBar>
      <NavLink to="/">home</NavLink>
      <NavLink to="/about">about us baby</NavLink>
    </NavBar>
    {@render children()}
  </div>
</PageContentContainer>
