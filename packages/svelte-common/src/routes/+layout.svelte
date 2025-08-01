<script lang="ts">
  import LettuceAvatar from '$lib/components/LettuceAvatar.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import NavLink from '$lib/components/NavLink.svelte';
  import { PageContentContainer } from '$lib/index.js';
  import '../app.css';
  let { children } = $props();
</script>

<PageContentContainer>
  <NavBar>
    <NavLink to="/"><span class="px-2 capitalize">home</span></NavLink>
    <NavLink to="/rankings"><span class="px-2 capitalize">rankings</span></NavLink>
    <NavLink to="/about"><span class="px-2 capitalize">about</span></NavLink>
    <NavLink to="/profile" class="ml-auto">
      <div class="hover:h-13 -m-1 aspect-square h-11 overflow-hidden rounded-lg transition-all duration-150 hover:-m-2">
        <LettuceAvatar name="lettucebowler" class="text-base!" />
      </div>
    </NavLink>
  </NavBar>
  {@render children()}
</PageContentContainer>
