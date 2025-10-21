<script lang="ts">
  import LettuceAvatar from '$lib/components/LettuceAvatar.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import NavLink from '$lib/components/NavLink.svelte';
  import { PageContentContainer } from '$lib/index.js';
  import '../app.css';
  let { children } = $props();
</script>

<PageContentContainer>
  <div class="p-2 min-[800px]:px-0 sm:p-4">
    <NavBar>
      <NavLink to="/" label="home" />
      <!-- <NavLink to="/rankings" label="rankings" />
      <NavLink to="/about" label="about" /> -->
      <NavLink to="/about" label="about us baby" />
      <!-- <NavLink to="/profile" class="ml-auto">
        <div class="aspect-square size-11 h-full p-1 transition-all duration-150 hover:p-0 sm:size-14">
          <div class="overflow-hidden rounded-lg">
            <LettuceAvatar name="lettucebowler" />
          </div>
        </div>
      </NavLink> -->
    </NavBar>
    {@render children()}
  </div>
</PageContentContainer>
